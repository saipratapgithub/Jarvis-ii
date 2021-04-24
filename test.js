var IHSEmailV2 = Class.create();

IHSEmailV2._createLogger = function() {
    return (new SysLogger('IHSEmailV2', true /*prefix message with milliseconds, for sorting*/));
};

IHSEmailV2.prototype = {
    // todo: compute and store 'two hours before report-end' as variable
    initialize: function(ihsGR, event, template) {
        this._ihsGR = ihsGR;
        this._event = event;
        this._template = template;
        this._logger = IHSEmailV2._createLogger();
        this._2hoursBeforeReportEnd = this._getDateTimeRelativeToReportEnd(-2 * 60 * 60);
        this._8hoursBeforeReportEnd = this._getDateTimeRelativeToReportEnd(-8 * 60 * 60);
        this._andUSG = IHS.hasUSG(ihsGR)?' and USG':'';
        this._orIsUSG = IHS.hasUSG(ihsGR)?' or is USG':'';
        this._visible={
            "managed_by":true,
            "group":true,
            "incident":true,
            "customer":true,
            "outage_end":true,
            "outage_duration":true,
            "stepsrelief":true

        };
    },

    _resetVisible:function() {

        this._visible={
            "managed_by":true,
            "group":true,
            "incident":true,
            "customer":true,
            "outage_end":true,
            "outage_duration":true,
            "stepsrelief":true

        };

    },


    generateEmail: function() {
        this._generateHeaderSection();
        this._generateTableSection();
        this._generateSummarySection();
        this._generateFooterSection();
    },

    // v-- private methods --v

    _getDateTimeRelativeToReportEnd: function(seconds) {
        var gdt = new GlideDateTime(this._ihsGR.u_handover_date_time.getGlideObject());
        gdt.addSeconds(seconds);
        return gdt.getValue();
    },

    _bold: function(str) { return '<strong>' + str + '</strong>';},
    _highlight: function(str) {return '<span style="background-color: #FFFF00">' + str + '</span>';},
    _underline: function(str) {return '<u>' + str + '</u>';},
    _color: function(str, color) {return '<span style="color: ' + color + '">' + str + '</span>';},

    _applyMajorIncidentHighlight: function(str) {
        return '<span style="background-color: #00ffff;">' + str + '</span>'; // aqua
    },

    _getIncidentColor: function(isGR) {
        var black = '#000000';
        var blue = '#0000ff';
        var red = '#ff0000';

        var state = isGR.getValue('u_incident_state');
        if('solution_proposed' == state || 'closed' == state) {
            return blue;
        }
        // andrew.martin march2015: gs.dateDiff is always returning 86400 when called from the email script, but correctly when called
        // from scripts background (with same isGR supplied)...a bug (you can even try hard-coding date string and compare the results
        // when running from SB versus an email script)
        //var hoursSinceDeclaredAsP1 = gs.dateDiff(isGR.u_declared_as_p1, this._nowGMT, true /*return seconds*/)/3600;

        return isGR.getValue('u_csm_critical') == true ? red:blue;
    },

    _applySummaryHeadingStyle: function(isGR, heading, color) {
        var txt = '<strong><span style="color: ' + color + '">' + heading + '</span></strong>';
        return ('1' == isGR.getValue('u_is_major'))?this._applyMajorIncidentHighlight(txt):txt;
    },

    // color is not applied when str is a link
    _applyReportColorAndHighlight: function(isGR, str) {
        var color = this._getIncidentColor(isGR);
        str = this._color(str, color);
        return ('1' == isGR.getValue('u_is_major'))?this._applyMajorIncidentHighlight(str):str;
    },

    _getStyledIncidentLink: function(isGR, color) {
        color = color || this._getIncidentColor(isGR);
        var url = this._getIncidentURL(isGR, color);
        return ('1' == isGR.getValue('u_is_major'))?this._applyMajorIncidentHighlight(url):url;
    },

    _getStyledCompanyName: function(isGR, color) {
        color = color || this._getIncidentColor(isGR);
        var cn = this._color(isGR.getValue('u_company_name'), color);
        return ('1' == isGR.getValue('u_is_major'))?this._applyMajorIncidentHighlight(cn):cn;
    },

    _generateHeaderSection: function() {
        // including paragraph because it gets added automatically if we don't explicitly
        // add it, and I want to control where it stops (so I can control spacing)
        var end = this._ihsGR.getValue('u_handover_date_time');
        this._template.print('<p><u><strong>P1 & Critical Case Summary Report</strong>' + ' ('+ end + ' GMT)</u><br/>');
        this._template.print('<strong>Current Shift: </strong>' + this._ihsGR.u_shift.getDisplayValue() + '<br/>');
        this._template.print('<strong>Duty CSM: </strong>' + this._ihsGR.u_shift_csm.getDisplayValue() + '<br/></p>');
    },

    _getTab: function() {return '&nbsp;&nbsp;&nbsp;&nbsp;';},

    _getTableBegin: function() {
        return "<table style='width:100%' border='1' bordercolor='black' cellpadding='10'>";
    },

    _getTableHeaderRowBegin: function() {
        return "<tr style='font-weight: bold; text-align: left;'>";
    },

    _getActiveTableHeaderRow: function(firstColumnText) {
        var p1Columns = firstColumnText.indexOf('Cases') == -1;
        var retString = "<colgroup>" +
            "<col span='6' style='width: 8%;'>" +
            "<col span='1' style='width: 26%;'>" +
            "<col span='1' style='width: 26%;'>" +
            "</colgroup>" +
            this._getTableHeaderRowBegin() +
            "<td colspan='8'>" + firstColumnText + "</td></tr>" +
            this._getTableHeaderRowBegin() +
            "<td>Managed By</td>" +
            "<td>Group</td>" +
            "<td>Case</td>" +
            "<td>Customer</td>" +
            "<td>Case Opened (GMT)</td>";

        //want to inject different columns for P1 vs non P1 critical ints
        if(p1Columns) {
            retString += "<td>Outage Duration</td>";
        } else {
            retString += "<td>Case Priority</td>";
        }
        retString += "<td>Issue</td><td>Next Action</td></tr>";

        return retString;
    },

    _getSNCcontactName: function(isGR) {
        // CSM critical managed by CSM, all others managed by the TSE
        if(isGR.getValue('u_csm_critical') === '1') {
            if(isGR.u_incident_csm.hasValue()) {
                return isGR.u_incident_csm.getDisplayValue() + ' (CSM)';
                // if CSM is not populated, see if we have the TSE
            } else if(isGR.u_assigned_to.hasValue()) {
                return isGR.u_assigned_to.getDisplayValue() + ' (TSE)';
            } else {
                return 'N/A';
            }
        } else {
            if(isGR.u_assigned_to.hasValue()) {
                return isGR.u_assigned_to.getDisplayValue() + ' (TSE)';
            }
        }
        return 'N/A';
    },

    _getTSEname: function(isGR) {
        if(isGR.u_assigned_to.hasValue()) {
            return isGR.u_assigned_to.getDisplayValue() + ' (TSE)';
        }
        return 'N/A';
    },

    _getAssignmentGroupName: function(isGR) {
        if(isGR.u_assignment_group.hasValue()) {
            return isGR.u_assignment_group.getDisplayValue();
        }
        return 'N/A';
    },

    _getActiveTableRow: function(isGR) {
        var retString = '';
        var sncContactName = this._getSNCcontactName(isGR);
        var groupName = this._getAssignmentGroupName(isGR);
        var color = this._getIncidentColor(isGR);
        /*
        var incidentURL = this._getIncidentURL(isGR, color);
        var customerName = this._color(isGR.getValue('u_company_name'), color);
         */
        var incidentURL = this._getStyledIncidentLink(isGR, color);
        var customerName = this._getStyledCompanyName(isGR, color);

        var isUSG = IS.isUSG(isGR);
        var isUSSoil = IS.isUSSoil(isGR);
        var isSecurity = IS.isSecurity(isGR);
        //var outageStart = isUSG?'N/A':isGR.getValue('u_outage_start_date_time');
        var opened = isUSG || isUSSoil || isSecurity ?'N/A':isGR.getValue('u_opened_at');
        var outageDuration = isUSG || isUSSoil || isSecurity ?'N/A':isGR.getDisplayValue('u_outage_duration');
        var intPriority = isGR.getDisplayValue('u_incident_priority');
        var issue = isGR.getValue('u_summary');
        var nextAction = isUSG || isUSSoil || isSecurity ?'N/A':isGR.getValue('u_next_action');

        // We should not escape sncContactName, groupName, incidentURL, and customerName
        //  because it can include a link.
        // opened and outageDuration should not contain a link and therefore escaping text

        retString = "<tr><td>" + sncContactName + "</td>" +
            "<td>" + groupName + "</td>" +
            "<td>" + incidentURL + "</td>" +
            "<td>" + customerName + "</td>" +
            "<td>" + JSUtil.escapeText(opened) + "</td>";

        if(isGR.getValue('u_incident_priority') == 'p1') {
            retString+= "<td>" + JSUtil.escapeText(outageDuration) + "</td>";
        } else {
            retString+= "<td>" + JSUtil.escapeText(intPriority) + "</td>";
        }
        retString += "<td>" + JSUtil.escapeText(issue) + "</td><td>" + JSUtil.escapeText(nextAction) + "</td></tr>";

        return retString;
    },

    // 	_getNotActiveTableHeaderRow: function() {
    // 		return "<colgroup>" +
    // 		"<col span='6' style='width: 8%;'>" +
    // 		"<col span='1' style='width: 52%;'>" +
    // 		"</colgroup>" +
    // 		this._getTableHeaderRowBegin() +
    // 		"<td>Managed By</td>" +
    // 		"<td>Group</td>" +
    // 		"<td>Incident</td>" +
    // 		"<td>Customer</td>" +
    // 		"<td>Outage End (GMT)</td>" +
    // 		"<td>Outage Duration</td>" +
    // 		"<td>Steps to Relief</td></tr>";
    // 	},

    _getNotActiveTableHeaderRow: function() {
        var tableString="<colgroup>" ;
        tableString+="<col span='6' style='width: 8%;'>";
        tableString+="<col span='1' style='width: 52%;'>" ;
        tableString+="</colgroup>" ;
        tableString+=this._getTableHeaderRowBegin() ;

        if(this._visible.managed_by)
            tableString+="<td>Managed By</td>";
        if(this._visible.group)
            tableString+="<td>Group</td>" ;
        if(this._visible.incident)
            tableString+="<td>Case</td>" ;
        if(this._visible.customer)
            tableString+="<td>Customer</td>" ;
        if(this._visible.outage_end)
            tableString+="<td>Outage End (GMT)</td>" ;
        if(this._visible.outage_duration)
            tableString+="<td>Outage Duration</td>" ;
        if(this._visible.stepsrelief)
            tableString+="<td>Steps to Relief</td></tr>";
        return tableString;
    },

    _getNotActiveTableRow: function(isGR) {

        var intPriority = isGR.getValue('u_incident_priority');
        var isUSG = IS.isUSG(isGR);
        var isUSSoil = IS.isUSSoil(isGR);
        var isSecurity = IS.isSecurity(isGR);
        var isDup = IS.isDuplicate(isGR);
        var tempRelief = IS.isTempRelief(isGR);
        var color = this._getIncidentColor(isGR);
        var tseName = this._getTSEname(isGR);
        var groupName = this._getAssignmentGroupName(isGR);
        /*
        var incidentURL = this._getIncidentURL(isGR, color);
        var customerName = this._color(isGR.getValue('u_company_name'), color);
         */
        var incidentURL = this._getStyledIncidentLink(isGR, color);
        var customerName = this._getStyledCompanyName(isGR, color);

        var outageEnd = isUSG || isUSSoil || isSecurity || intPriority != 'p1'?'N/A' :isGR.getValue('u_outage_end_date_time');
        var outageDuration = isUSG || isUSSoil || isSecurity || intPriority != 'p1'?'N/A' :isGR.getDisplayValue('u_outage_duration');

        var stepsToRelief = isDup||isUSG || isUSSoil || isSecurity ?'N/A':isGR.getValue('u_most_probable_cause'); // fieldname mismatches because it has been reused
        //var nextAction = isUSG?'N/A':isGR.getValue('u_next_action');
        //var state = isGR.getDisplayValue('u_incident_state');
        var tableString='';

        if(this._visible.managed_by)
            tableString+="<tr><td>" + tseName + "</td>";
        if(this._visible.group)
            tableString+="<td>" + groupName + "</td>" ;
        if(this._visible.incident)
            tableString+="<td>" + incidentURL + "</td>" ;
        if(this._visible.customer)
            tableString+="<td>" + customerName + "</td>" ;
        if(this._visible.outage_end)
            tableString+="<td>" + outageEnd + "</td>" ;
        if(this._visible.outage_duration)
            tableString+="<td>" + outageDuration + "</td>" ;
        if(this._visible.stepsrelief)
            tableString+="<td>" + stepsToRelief + "</td></tr>";
        return tableString.trim();
    },

    _generateActiveTable: function(isGR, csmCritical, p1) {
        var firstHeaderColumnText = '';
        if(0 == isGR.getRowCount()) {
            return false;
        }
        this._template.print(this._getTableBegin());
        if(p1) {
            firstHeaderColumnText = csmCritical?'Critical P1s':'Non-Critical P1s';
        } else {
            firstHeaderColumnText = csmCritical?'Critical Cases (Non P1s)':'Non-Critical Cases (Non P1s)';
        }
        this._template.print(this._getActiveTableHeaderRow(firstHeaderColumnText));
        while(isGR.next()) {
            this._template.print(this._getActiveTableRow(isGR));
        }
        this._template.print("</table>");
        return true;
    },

    _generateNotActiveTable: function(isGR) {
        if(0 == isGR.getRowCount()) {
            return false;
        }
        this._template.print(this._getTableBegin());
        this._template.print(this._getNotActiveTableHeaderRow());
        while(isGR.next()) {
            this._template.print(this._getNotActiveTableRow(isGR));
        }
        this._template.print("</table>");
        return true;
    },

    _getNewOrWIPCriticalP1s: function() {
        var eq = '^u_csm_critical=true^u_incident_priority=p1^u_temporary_relief=false';
        return IHS.getNewOrWIP(this._ihsGR, false /*onlyUSG*/, true /*emailSortOrder*/, eq, true /*p1Priority*/);
    },

    _getNewOrWIPNonCriticalP1s: function() {
        var eq = '^u_csm_critical=false^u_incident_priority=p1^u_temporary_relief=false';
        return IHS.getNewOrWIP(this._ihsGR, false /*onlyUSG*/, true /*emailSortOrder*/, eq, true /*p1Priority*/);
    },

    _getNewOrWIPCSMCriticalNonP1s: function() {
        var eq = '^u_csm_critical=true^u_incident_priority!=p1^u_temporary_relief=false';
        return IHS.getNewOrWIP(this._ihsGR, false /*onlyUSG*/, true /*emailSortOrder*/, eq, false /*p1Priority*/);
    },

    _getNewOrWIPDowngradedP1s: function() {
        var eq = '^u_csm_critical=false^u_downgraded_from_new_or_wip=true^u_temporary_relief=false';
        return IHS.getNewOrWIP(this._ihsGR, false /*onlyUSG*/, true /*emailSortOrder*/, eq, false /*p1Priority*/);
    },

    _getNewOrWIPwithinTwoHours: function() {
        var eq = 'u_incident_priority=p1^u_declared_as_p1>=' + this._2hoursBeforeReportEnd;
        return IHS.getNewOrWIP(this._ihsGR, false /*onlyUSG*/, true /*emailSortOrder*/, eq, true /*p1Priority*/);
    },

    _getNeworWIPbeyondTwoHours: function() {
        // u_declared_as_p1 is empty for USG incidents -- we are showing them in the second table
        // since it's the conservative option (longer running incidents get more attention)
        //
        eq = 'u_incident_priority=p1^u_declared_as_p1<' + this._2hoursBeforeReportEnd + '^ORu_is_usg=true';
        return IHS.getNewOrWIP(this._ihsGR, false /*onlyUSG*/, true /*emailSortOrder*/, eq, true /*p1Priority*/);
    },

    _generateTableSection: function() {

        // New/WIP
        var tableHeader = 'Current P1s and Critical Cases:' + this._getTab() + this._ihsGR.getValue('u_new_or_wip_at_shift_end');
        this._template.print(this._bold(this._highlight(tableHeader)) + '<br/>');

        // New/WIP and CSM Critical P1s
        var isGR = this._getNewOrWIPCriticalP1s();
        if(this._generateActiveTable(isGR, true /*csmCritical*/, true /* p1s */))
            this._template.print('<br/>');
        this._template.print('<br/>');

        // New/WIP CSM Critical (All other Priorities)
        isGR = this._getNewOrWIPCSMCriticalNonP1s();
        if(this._generateActiveTable(isGR, true /*csmCritical*/, false /* p1s */)) {
            this._template.print('<br/>');
            this._template.print('<br/>');
        }

        // New/WIP and not CSM Critical P1s
        isGR = this._getNewOrWIPNonCriticalP1s();
        if(this._generateActiveTable(isGR, false /*csmCritical*/, true /* p1s */)) {
            this._template.print('<br/>');
            this._template.print('<br/>');
        }




        // SP/Closed since the last report
        isGR = IHS.getSolutionProposedOrClosed(this._ihsGR, true /*emailSortOrder*/, true /*excludeDowngrades*/);
        // don't use 'u_sp_or_closed_in_shift' because it includes downgrades
        tableHeader = 'SP/Closed/Temporary Relief since the last report:' + this._getTab() + isGR.getRowCount();
        this._template.print(this._bold(this._highlight(tableHeader)) + '<br/>');
        this._generateNotActiveTable(isGR);
        this._resetVisible();
        this._template.print('<br/>');
        this._template.print('<br/>');


        // Downgraded P1s
        isGR = IHS.getDowngradesInNewOrWIP(this._ihsGR, false /*onlyUSG*/);
        tableHeader = 'Downgraded since the last report:' + this._getTab() + isGR.getRowCount();
        this._visible.outage_end=false;
        this._visible.outage_duration=false;
        this._visible.stepsrelief=false;

        this._template.print(this._bold(this._highlight(tableHeader)) + '<br/>');
        this._generateNotActiveTable(isGR);
        this._resetVisible();
        this._template.print('<br/>');
        this._template.print('<br/>');
    },

    _generateSummarySectionActive: function(isGR) {
        if(0 == isGR.getRowCount()) {
            this._template.print('<br/>');
            return;
        }
        while(isGR.next()) {
            this._outputNewOrWipSummary(isGR);
            this._template.print('<br/>');
        }
    },

    _generateSummarySectionNotActive: function(isGR) {
        if(0 == isGR.getRowCount()) {
            this._template.print('<br/>');
        }
        while(isGR.next()) {
            this._outputSolutionProposedOrClosedSummary(isGR);
            this._template.print('<br/>');
        }
    },

    _generateSummarySection: function() {
        // New/WIP and CSM-Critical
        var isGR = this._getNewOrWIPCriticalP1s();
        var paragraphSectionHeader = 'Critical P1s:' + this._getTab() + isGR.getRowCount();
        this._template.print(this._bold(this._underline(paragraphSectionHeader)) + '<br/>');
        this._generateSummarySectionActive(isGR);

        //New/WIP CSM-Critical Non P1s
        isGR = this._getNewOrWIPCSMCriticalNonP1s();
        paragraphSectionHeader = 'Critical Cases (Non P1s):' + this._getTab() + isGR.getRowCount();
        this._template.print(this._bold(this._underline(paragraphSectionHeader)) + '<br/>');
        this._generateSummarySectionActive(isGR);

        // New/WIP and not CSM-Critical
        isGR = this._getNewOrWIPNonCriticalP1s();
        paragraphSectionHeader = 'Non-Critical P1s:' + this._getTab() + isGR.getRowCount();
        this._template.print(this._bold(this._underline(paragraphSectionHeader)) + '<br/>');
        this._generateSummarySectionActive(isGR);

        // SP/Closed since the last report
        isGR = IHS.getSolutionProposedOrClosed(this._ihsGR, true /*emailSortOrder*/, true /*excludeDowngrades*/);
        // don't use 'u_sp_or_closed_in_shift' because it includes downgrades
        paragraphSectionHeader = 'SP/Closed/Temporary Relief since the last report:' + this._getTab() + isGR.getRowCount();
        this._template.print(this._bold(this._underline(paragraphSectionHeader)) + '<br/>');
        this._generateSummarySectionNotActive(isGR);


        // 		// Downgraded since the last report
        // 		isGR = IHS.getDowngradesInNewOrWIP(this._ihsGR, false /*onlyUSG*/);
        // 		paragraphSectionHeader = 'Downgraded since the last report:' + this._getTab() + isGR.getRowCount();
        // 		this._template.print(this._bold(this._underline(paragraphSectionHeader)) + '<br/>');
        // 		this._generateSummarySectionNotActive(isGR);
    },

    _generateFooterSection: function() {
        this._template.print('<span style="text-decoration: underline;"><strong>Legend</span></span><br/>');
        if('0' < this._ihsGR.getValue('u_major_incident_count')) {
            this._template.print(this._applyMajorIncidentHighlight('Aqua: Mass Outage Information') + '<br/>');
        }
        this._template.print('<span style="color: #ff0000;">Red:  CSM-Critical</span></strong><br/>');
        this._template.print('<span style="color: #0000ff;">Blue: Non CSM-Critical or is SP/Closed/Temporary Relief</span><br/>');
        this._template.print('<br/>');
        this._template.print('<strong>Email Sent By: </strong>' + this._event.parm2 + '<br/>');
        this._template.print('<strong>Email Generated From: </strong>' + this._getIHSURL() + ' (login with your Corporate Active Directory credentials)');
    },

    _getIncidentURL: function(isGR, color) {
        return "<a target='_blank' style='color: " + color + "' href='" + isGR.getValue('u_incident') + "'>" + isGR.getValue('u_incident_number') + "</a>";
    },

    _getIncidentURLv2: function(isGR) {
        return "<a target='_blank' href='" + isGR.getValue('u_incident') + "'>" + isGR.getValue('u_incident_number') + "</a>";
    },

    _outputSummaryHeading: function(isGR) {
        var color = this._getIncidentColor(isGR);
        var incidentURL = this._getIncidentURL(isGR, color);
        var instanceType = isGR.getDisplayValue('u_instance_type');
        var companyName = isGR.getValue('u_company_name');
        var summaryHeading = incidentURL;
        if('Unknown' != instanceType) {
            summaryHeading += ' - ' + instanceType;
        }
        if(!IS._stringHasNoValue(companyName)) {
            summaryHeading += ' - ' + companyName;
        }
        this._template.print(this._applySummaryHeadingStyle(isGR, summaryHeading, color) + '<br/>');
    },

    _outputSummaryField: function(isGR, fieldName) {
        var label = '';
        if('u_incident_category' == fieldName) {
            label = 'Case Category';
        } else {
            label = isGR.getElement(fieldName).getLabel();
        }
        var value = isGR.getValue(fieldName);
        if(('u_outage_start_date_time' == fieldName || 'u_outage_end_date_time' == fieldName) && !gs.nil(value)) {
            value += ' GMT';
        }
        if('u_outage_end_date_time' == fieldName && gs.nil(value)) {
            value = 'N/A';
        }
        if('u_outage_duration' == fieldName || 'u_incident_category' == fieldName || 'u_incident_priority' == fieldName) {
            value = isGR.getDisplayValue(fieldName);
        }

        // using strong instead of b because this is being output together with HTML that is specified via Email Notification HTML Message
        // editor and that editor (i.e. tinyMCE) is using strong
        // escaping text on Outage Start Time, Outage End Time, Issue, What Has Been Done So Far,
        //  Next Action
        if('u_csm_action' == fieldName || 'u_next_action' == fieldName) {
            this._template.print('<strong>' + label + ':</strong><br/> ' + JSUtil.escapeText(value) + '<br/>');
        } else {
            this._template.print('<strong>' + label + ':</strong> ' + JSUtil.escapeText(value) + '<br/>');
        }
    },

    _outputSummary: function(isGR, fields) {
        this._outputSummaryHeading(isGR);
        if('1' == isGR.getValue('u_is_major')) {
            this._template.print('<strong><em>Number of Child Cases: </em></strong>' + isGR.getValue('u_child_incident_count') + '<br/>');
        }
        for(x=0; x<fields.length; x++) {
            this._outputSummaryField(isGR, fields[x]);
        }
    },

    _outputNewOrWipSummary: function(isGR) {
        var fields;
        if(IS.isUSG(isGR) || IS.isUSSoil(isGR) || IS.isSecurity(isGR)) {
            fields = ['u_summary'];
        } else if(isGR.u_incident_priority == 'p1') {
            fields = ['u_outage_start_date_time', 'u_outage_end_date_time', 'u_incident_category', 'u_summary', 'u_csm_action', 'u_next_action'];
        } else {
            fields = ['u_incident_priority', 'u_incident_category', 'u_summary', 'u_csm_action', 'u_next_action'];
        }
        this._outputSummary(isGR, fields);
    },

    _outputSolutionProposedOrClosedSummary: function(isGR) {
        var fields;
        if(IS.isDuplicate(isGR) || IS.isUSG(isGR) || IS.isUSSoil(isGR) || IS.isSecurity(isGR)) {
            fields = ['u_summary'];
        } else {
            if(isGR.u_incident_priority == 'p1') {
                fields = ['u_outage_start_date_time', 'u_outage_end_date_time', 'u_incident_category', 'u_outage_duration', 'u_summary', 'u_most_probable_cause', 'u_next_action'];
            } else {
                fields = ['u_incident_priority', 'u_incident_category', 'u_summary', 'u_most_probable_cause', 'u_next_action'];
            }
        }
        this._outputSummary(isGR, fields);
    },

    _getIHSURL: function() {
        var ihsNumber = this._ihsGR.getValue('u_number');
        var href = 'https://' + gs.getProperty('instance_name', 'instance_name') + '.service-now.com/u_incident_handover_summary.do?sysparm_query=u_number=' + ihsNumber;
        return "<a target='_blank' href='" + href + "'>" + ihsNumber + "</a>";
    },

    type: 'IHSEmailV2'
};

var BCDR = Class.create();

BCDR.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	intialize:function(){

    },
    autoCommsHtmlUpdate: function(){


        //var grIncident = new GlideRecord('sys_template');
        //	var returnValue = grIncident.get('d9d51c910f3ebe006d99563be1050ef6');
//applyTemplate(" IncidentTemplateForKolkataLocation");	d9d51c910f3ebe006d99563be1050ef6

// var grIncident = new GlideRecord('sys_template');
// var returnValue=grIncident.get('name','u_cs_communications_tool');
// 	//var returnValue = grIncident.get('d9d51c910f3ebe006d99563be1050ef6');
// var temp=grIncident.template;
// gs.addInfoMessage("PPPPPPP-0000000-1111111"+temp+returnValue.u_content);
        //grIncident.addQuery('name',this.getParameter('name'));
        //grIncident.query();
// 		if(grIncident.next()){
// 			temp=grIncident.getValue('name');
// 		   //temp=grIncident.template;
// 		gs.addInfoMessage("PPPPPPP-0000000-1111111"+grIncident+temp);

// 		}

        var temp;
        var grIncident = new GlideRecord('sys_template');
        if (grIncident.get('d9d51c910f3ebe006d99563be1050ef6')) {
            gs.addInfoMessage("OOOOOO"+grIncident.template.u_content);
            gs.addInfoMessage("OOOOOO"+grIncident.template);

        }
//var returnValue=grIncident.get('name','u_cs_communications_tool');
        //returnValue=true;
        gs.addInfoMessage("PPPPPPP-111111"+grIncident.template+grIncident.u_content+grIncident.template.u_content);
        temp=grIncident.template;
        gs.addInfoMessage("PPPPPPP-111111"+temp);
        temp = temp.replace(/&lt;Title Goes Here&gt;/g,this.getParameter('u_short_description'));
        temp = temp.replace(/&lt;The purpose of this email is to notify teams.&gt;/g,this.getParameter('u_short_description'));
        temp = temp.replace(/&lt;The background of the initiative.&gt;/g,this.getParameter('u_description'));
        temp = temp.replace(/&lt;List of useful resources&gt;/g,'');
        temp = temp.replace(/List of KB's and links/g,"INC Number (HI) : "+this.getParameter('u_incident_num')+"             <br/>"+"<li>INC Number (SURF) : "+this.getParameter('u_inc_number1_surf')+"</li>"+"<li> Casual CHG  Number :               "+this.getParameter('u_cause_num'))+"</li>";
        temp = temp.replace(/URL to Box, \etc/g,"Remidial CHG  Number :"+this.getParameter('u_remedy_num'));
        temp = temp.replace(/&lt;If there are questions, who to reach out to\?&gt;/g,"OpenedBy : "+this.getParameter('u_opened_by') +",  "+this.getParameter('u_opened_by_email'));
        temp=temp.replace('CURRENT_URL_LINK','');
        gs.addInfoMessage("PPPPPPP-3333333"+temp);

        var gr = new GlideRecord('u_cs_communications_tool');
        gr.initialize();
        gr.setValue('u_subject', this.getParameter('u_short_description') );
        gr.setValue('u_users', this.getParameter('u_opened_by'));
        gr.setValue('u_content',temp);
        if(gr.insert()){
            //temp= gr.applyTemplate('u_cs_communications_tool');
            // gr.setValue('u_content',temp);
            //gr.update();

            gs.addInfoMessage("PPPPPPP-444444"+temp);

            return gr.getLink(true);
        }
    },
    getIVRMesssage: function() {
        var id = this.getParameter('sysparm_category');
        var gi = new GlideRecord("u_ivr_crisis_message_system");
        gi.addQuery('u_outage_category',id);
        gi.query();
        var ivr='';
        if ( gi.next() ) {
            ivr=gi.u_procedure;
        }
        return ivr;
    },
    getHIMesssage: function() {
        var id = this.getParameter('sysparm_category');
        var gh = new GlideRecord("u_ivr_crisis_message_system");
        gh.addQuery('u_outage_category',id);
        gh.query();
        var hi='';
        if ( gh.next() ) {
            hi=gh.u_procedure;
        }
        return hi;
    },
    getEmail: function() {
        var id = this.getParameter('sysparm_userID');
        var user = new GlideRecord("sys_user");
        user.get(id);
        return user.email;
    },
    getLocation: function() {
        var loc;
        var id=gs.getUser().getLocation();
        var gl = new GlideRecord("cmn_location");
        gl.addQuery('sys_id',id);
        gl.query();
        if ( gl.next() ) {
            loc=gl.name;
        }
        return loc;
    },
    getDispatchUsers: function(){
        var location_name = this.getParameter('sysparm_location_name');
        var gr = new GlideRecord('x_snc_dispatch_users');
        gr.addQuery('user.location.name','CONTAINS', location_name);
        gr.addQuery('mifi_contact', true);
        gr.query();
        var result = [];
        while(gr.next()){
            result.push(gr.user.first_name+" "+gr.user.last_name);
        }
        return result.join(',');
    },
    getEscalationContact: function(){

        gs.include('moment.js');
        gs.include('moment-timezone-with-data-2012-2022.js');

        var gr = new GlideRecord('cmn_location');
        var result = [];

        var time = moment.utc().format("HH:mm").split(':');
        var minutes = Number(time[0]) * 60 + Number(time[1]);
        if(minutes >= 211 && minutes <= 420){
            gr.addEncodedQuery('name=ind^ORname=apj^contactISNOTEMPTY');
        }
        if(minutes >= 421 && minutes <= 690){
            gr.addEncodedQuery('name=ind^ORname=emea^contactISNOTEMPTY');
        }
        if(minutes >= 691 && minutes <= 780){
            gr.addEncodedQuery('name=emea^contactISNOTEMPTY');
        }
        if(minutes >= 781 && minutes <= 960){
            gr.addEncodedQuery('name=emea^ORname=ams^contactISNOTEMPTY');
        }
        if(minutes >= 961 && minutes <= 1320){
            gr.addEncodedQuery('name=ams^contactISNOTEMPTY');
        }
        if((minutes >= 1321 && minutes <= 1439) || minutes == 0){
            gr.addEncodedQuery('name=ams^ORname=apj^contactISNOTEMPTY');
        }
        if(minutes >= 1 && minutes <= 210){
            gr.addEncodedQuery('name=apj^contactISNOTEMPTY');
        }
        gr.query();
        while(gr.next()){
            var obj = {};
            obj.sys_id = gr.contact.sys_id+'';
            obj.first_name = gr.contact.first_name+'';
            obj.last_name = gr.contact.last_name+'';
            obj.title = gr.contact.title+'';
            obj.business_phone = gr.contact.phone+'';
            obj.mobile_phone = gr.contact.mobile_phone+'';
            obj.email = gr.contact.email+'';
            result.push(obj);
        }
        var jsonObj = JSON.stringify(result);
        return jsonObj;
    },
    getFormData: function(){
        var number = this.getParameter('sysparm_number');
        var gr = new GlideRecord('u_bcdr_workspace');
        gr.addQuery('u_number', number);
        gr.query();
        var created_on = '';
        while(gr.next()){
            var gDate = new GlideDateTime(gr.sys_created_on);
            created_on = gDate.getDate()+'';
        }
        return created_on;
    },
    type: 'BCDR'
});

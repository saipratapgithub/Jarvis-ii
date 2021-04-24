function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }
    var placeHolderName = g_form.getControl('u_short_description').name;
    if(newValue){
        var ivrDisable = new GlideAjax('BCDR');
        ivrDisable.addParam('sysparm_name','getIVRMesssage');
        ivrDisable.addParam('sysparm_category',"Disable");
        ivrDisable.getXML(setIVRDisableMessage);
    }
    function setIVRDisableMessage(res){
        var ivr = res.responseXML.documentElement.getAttribute("answer");
        g_form.setValue('u_disable_ivr',ivr);
    }
    var category = g_form.getValue('u_outage_category');


    if(newValue == 'network'){
        g_form.setValue('u_short_description','');
        addDefaultPlaceHolder(placeHolderName,'Network connectivity has gone down at (Region Site) office and no one is able to connect.');
        g_form.setDisplay('u_region',true);
        g_form.setDisplay('u_site',true);
        g_form.setDisplay('u_outage_type',false);
        g_form.clearOptions('u_region');
        g_form.addOption('u_region','apj','APJ');
        g_form.addOption('u_region','emea','EMEA');
        g_form.addOption('u_region','ind','IND');
        g_form.addOption('u_region','us','US');
        var ivr = new GlideAjax('BCDR');
        ivr.addParam('sysparm_name','getIVRMesssage');
        ivr.addParam('sysparm_category',"Production");
        ivr.getXML(setIVRMessage);
    }
    function setIVRMessage(res){
        var ivr = res.responseXML.documentElement.getAttribute("answer");
        g_form.setValue('u_ivr_crisis_message',ivr);
    }
    if(newValue == 'hi'){
        g_form.setValue('u_short_description','');
        addDefaultPlaceHolder(placeHolderName,'Hi is not accessible.');
        g_form.setDisplay('u_region',false);
        g_form.setDisplay('u_site',false);
        g_form.setDisplay('u_outage_type',false);
        var ivrHI = new GlideAjax('BCDR');
        ivrHI.addParam('sysparm_name','getIVRMesssage');
        ivrHI.addParam('sysparm_category',"Production");
        ivrHI.getXML(setIVRMessage);

        //code for escalation contacts
        var timeZone = new GlideAjax('BCDREscalationContacts');
        timeZone.addParam('sysparm_name', 'getLoggedInUserData');
        timeZone.getXML(parseEscalationResult);

    }

    if(newValue == 'cti'){
        g_form.setDisplay('u_region',true);
        g_form.setDisplay('u_site',true);
        g_form.clearOptions('u_outage_type');
        g_form.addOption('u_outage_type','domestic_incoming','Domestic/Incoming (HYD)');
        g_form.addOption('u_outage_type','domestic_outgoing','Domestic/Outgoing (HYD)');
        g_form.addOption('u_outage_type','incoming','Incoming');
        g_form.addOption('u_outage_type','outgoing','Outgoing');
        g_form.addOption('u_outage_type','finesse','Finesse');
        g_form.addOption('u_outage_type','no_calls','No calls');
        g_form.setDisplay('u_outage_type',true);
        var ivrCTI = new GlideAjax('BCDR');
        ivrCTI.addParam('sysparm_name','getIVRMesssage');
        ivrCTI.addParam('sysparm_category',"CTI");
        ivrCTI.getXML(setIVRMessage);
    }
    if(newValue == 'facilities'){
        g_form.setValue('u_short_description','');
        addDefaultPlaceHolder(placeHolderName,'Power down in Santa Clara, CA.');
        g_form.setDisplay('u_region',true);
        g_form.setDisplay('u_site',true);
        g_form.setDisplay('u_outage_type',false);
        g_form.clearOptions('u_region');
        g_form.addOption('u_region','apj','APJ');
        g_form.addOption('u_region','emea','EMEA');
        g_form.addOption('u_region','ind','IND');
        g_form.addOption('u_region','us','US');
        var ivrAdHoc = new GlideAjax('BCDR');
        ivrAdHoc.addParam('sysparm_name','getIVRMesssage');
        ivrAdHoc.addParam('sysparm_category',"AdHoc");
        ivrAdHoc.getXML(setIVRMessage);
    }
    if((newValue == 'network' || newValue == 'cti' || newValue == 'facilities') && (g_form.getValue('u_region') == 'ind')){
        g_form.setDisplay('u_mifi_contacts', false);
        g_form.setDisplay('u_mifi_ind', true);
    }
    if((newValue == 'network' || newValue == 'cti' || newValue == 'facilities') && (g_form.getValue('u_region') != 'ind')){
        g_form.setDisplay('u_mifi_contacts', true);
        g_form.setDisplay('u_mifi_ind', false);
    }
    if(newValue == 'hi'){
        g_form.setDisplay('u_mifi_contacts', false);
        g_form.setDisplay('u_mifi_ind', false);
    }
    if(isLoading && !g_form.isNewRecord()){
        g_form.setValue('u_outage_category', category);
    }

    function parseEscalationResult(response){
        var result = response.responseXML.documentElement.getAttribute("answer");
        var result1 = JSON.parse(result);
        g_form.setValue('u_outage_content',buildHTML(result1) );
    }
    function buildHTML(result){

        var userString = "";
        for(var i=0; i<result.length; i++){
            userString+='<div style="display:inline-block; margin-left: 5%;"><h5 style="font-weight: 100; margin-left: 10px;">'+ result[i].first_name+"  "+result[i].last_name+'</h5><h5 style="font-weight: 100; margin-left: 10px;">'+result[i].title+'</h5><h5 style="font-weight: 100; margin-left: 10px;">Email: '+result[i].email+'</h5><h5 style="font-weight: 100; margin-left: 10px;">Mobile: '+result[i].mobile_phone+'</h5><h5 style="font-weight: 100; margin-left: 10px;">Work: '+result[i].business_phone+'</h5></div>';
        }


        var htmlString = '<div style="border: 1px solid grey; width: 60%; margin-left: 15%; border-radius: 10px;"><h4 style="line-height: 60px;background-color: lightgrey; margin: 0px; border-top-left-radius: 10px; border-top-right-radius: 10px; height: 60px; text-align: center;">Production Outage Message</h4>'+userString+'</div>';

        return htmlString;
    }
}

//var ff='<style type="text/css">div,p,ul,li,span {word-break:normal}</style><div style="width:1000px;"><div style="border:3px solid black;  width:100%; overflow: hidden;"><img src="/cs_communications_tools_header.png" width="100%" height="125" style="max-height: 125; max-width: 100%;"/><div style="margin:0px 10px; font-family: helvetica;"></br><div id="to"><p style="margin: 0in 0in 0.0001pt; font-size: 12pt;" data-mce-style="font-size: 12pt;"><span style="font-family: helvetica;"><strong><span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">To: &lt;List of Distribution&gt;</span></strong></span></p></div><div id="title"><p style="font-size: 12pt;margin: 0in 0in 0.0001pt; " data-mce-style="font-size: 12pt;"><span style="font-family: helvetica;"><strong><span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">Title:&nbsp;&lt;Title Goes Here&gt;</span></strong></span></p><br /></div><div id="what"><p><span style="font-size: 12pt;"><strong><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">What:</span></strong>&nbsp;</span></p><span><p style="font-size: 12pt;">&lt;The purpose of this email is to notify teams.&gt;</p></span></div><div id="background"><p><span style="font-size: 12pt;"><strong><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Background:</span></strong>&nbsp;</span></p><p style="font-size: 12pt;">&lt;The background of the initiative.&gt;</p></div><div id="usefulResources"><p><span style="font-size: 12pt; margin: 0in 0in 0.0001pt;"><strong><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Useful Resource:</span></strong>&nbsp;</span></p><p style="font-size: 12pt; margin: 0in 0in 0.0001pt;">&lt;List of useful resources&gt;<ul style="font-size: 12pt; margin: 0in 0in 0.0001pt;">List of KBs and links</ul><ul style="font-size: 12pt; margin: 0in 0in 0.0001pt;">URL to Box, etc</ul></p><br /></div><div id="supportContacts"><p><span style="font-size: 12pt;"><strong><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Support Contacts:</span></strong>&nbsp;</span></p><p style="font-size: 12pt;">&lt;If there are questions, who to reach out to?&gt;</p><br /><br /><br /></div></div></div></div>';
// 		ff = ff.replace(/&lt;Title Goes Here&gt;/g,this.getParameter('u_short_description'));
// 		ff = ff.replace(/&lt;The purpose of this email is to notify teams.&gt;/g,this.getParameter('u_short_description'));
// 		ff = ff.replace(/&lt;The background of the initiative.&gt;/g,this.getParameter('u_description'));
// 		ff = ff.replace(/&lt;List of useful resources&gt;/g,"INC Number (HI) : "+this.getParameter('u_incident_num')+"<br/>"
// 						+"INC Number (SURF) : "+this.getParameter('u_inc_number1_surf'));
// 		ff = ff.replace(/List of KBs and links/g,"Casual CHG  Number : "+this.getParameter('u_cause_num'));
// 		ff = ff.replace(/URL to Box, \etc/g,"Remidial CHG  Number :"+this.getParameter('u_remedy_num'));
// 		ff = ff.replace(/&lt;If there are questions, who to reach out to\?&gt;/g,"OpenedBy : "+this.getParameter('u_opened_by') +"<br\>  "+ "OpenedBy Email :  "+this.getParameter('u_opened_by_email'));

// 		if( tt=="finish"){
// 				var members=[];
// 		members.push(this.getParameter('u_opened_by'));
// 		var gr = new GlideRecord('u_cs_communications_tool');
// 			gr.initialize();
// 		    gr.setValue('u_subject', this.getParameter('u_short_description') );
// 	        gr.setValue('u_users', members);
// 		    gr.setValue('u_content',template);
// 		    if(gr.insert()){
// 				//return gr.getLink(true);
// 		    }
// 		}






// 	autoCommsHtmlUpdate: function(obj){ sys_template
// 		var ff='<style type="text/css">div,p,ul,li,span {word-break:normal}</style><div style="width:1000px;"><div style="border:3px solid black;  width:100%; overflow: hidden;"><img src="/cs_communications_tools_header.png" width="100%" height="125" style="max-height: 125; max-width: 100%;"/><div style="margin:0px 10px; font-family: helvetica;"></br><div id="to"><p style="margin: 0in 0in 0.0001pt; font-size: 12pt;" data-mce-style="font-size: 12pt;"><span style="font-family: helvetica;"><strong><span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">To: &lt;List of Distribution&gt;</span></strong></span></p></div><div id="title"><p style="font-size: 12pt;margin: 0in 0in 0.0001pt; " data-mce-style="font-size: 12pt;"><span style="font-family: helvetica;"><strong><span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">Title:&nbsp;&lt;Title Goes Here&gt;</span></strong></span></p><br /></div><div id="what"><p><span style="font-size: 12pt;"><strong><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">What:</span></strong>&nbsp;</span></p><span><p style="font-size: 12pt;">&lt;The purpose of this email is to notify teams.&gt;</p></span></div><div id="background"><p><span style="font-size: 12pt;"><strong><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Background:</span></strong>&nbsp;</span></p><p style="font-size: 12pt;">&lt;The background of the initiative.&gt;</p></div><div id="usefulResources"><p><span style="font-size: 12pt; margin: 0in 0in 0.0001pt;"><strong><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Useful Resource:</span></strong>&nbsp;</span></p><p style="font-size: 12pt; margin: 0in 0in 0.0001pt;">&lt;List of useful resources&gt;<ul style="font-size: 12pt; margin: 0in 0in 0.0001pt;">List of KBs and links</ul><ul style="font-size: 12pt; margin: 0in 0in 0.0001pt;">URL to Box, etc</ul></p><br /></div><div id="supportContacts"><p><span style="font-size: 12pt;"><strong><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Support Contacts:</span></strong>&nbsp;</span></p><p style="font-size: 12pt;">&lt;If there are questions, who to reach out to?&gt;</p><br /><br /><br /></div></div></div></div>';
// 		ff = ff.replace(/&lt;Title Goes Here&gt;/g,obj.u_short_description);
// 		ff = ff.replace(/&lt;The purpose of this email is to notify teams.&gt;/g,obj.u_short_description);
// 		ff = ff.replace(/&lt;The background of the initiative.&gt;/g,obj.u_description);
// 		ff = ff.replace(/&lt;List of useful resources&gt;/g,"INC Number (HI) : "+obj.u_incident_num+"<br/>"
// 						+"INC Number (SURF) : "+obj.u_inc_number1_surf);
// 		ff = ff.replace(/List of KBs and links/g,"Casual CHG  Number : "+obj.u_cause_num);
// 		ff = ff.replace(/URL to Box, \etc/g,"Remidial CHG  Number :"+obj.u_remedy_num);
// 		ff = ff.replace(/&lt;If there are questions, who to reach out to\?&gt;/g,"OpenedBy : "+obj.u_opened_by +"<br\>  "+ "OpenedBy Email :  "+obj.u_opened_by_email);
// 		var members=[];
// 		members.push(obj.u_opened_by);
// 		var gr = new GlideRecord('u_cs_communications_tool');
// 			gr.initialize();
// 		    gr.setValue('u_subject', obj.u_short_description);
// 	        gr.setValue('u_users', members);
// 		    gr.setValue('u_content',ff);
// 		    if(gr.insert()){
// 		    gr.getValue('sys_id');
// 		    var url = 'https://' + gs.getProperty('instance_name', 'instance_name') + '.service-  now.com/u_cs_communications_tool.do?sysparm_sys_id=';
// 			var link=url+gr.getValue('sys_id');
// 		    gs.addInfoMessage("SAI-1111133333"+link);
// 			//gs.setRedirect(gr.getLink(true));
// 			//window.open(link,"_blank","height:20px","width:20px");
// 				return gr;
// 		    }
// 		},



//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////   Working code   ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

    var grIncident = new GlideRecord('sys_template');
    var returnValue = grIncident.get('name','u_cs_communications_tool');
    var temp=grIncident.template;
    temp = temp.replace(/&lt;Title Goes Here&gt;/g,this.getParameter('u_short_description'));
    temp = temp.replace(/&lt;The purpose of this email is to notify teams.&gt;/g,this.getParameter('u_short_description'));
    temp = temp.replace(/&lt;The background of the initiative.&gt;/g,this.getParameter('u_description'));
    temp = temp.replace(/&lt;List of useful resources&gt;/g,"INC Number (HI) : "+this.getParameter('u_incident_num')+"<br/>"
        +"INC Number (SURF) : "+this.getParameter('u_inc_number1_surf'));
    temp = temp.replace(/List of KBs and links/g,"Casual CHG  Number : "+this.getParameter('u_cause_num'));
    temp = temp.replace(/URL to Box, \etc/g,"Remidial CHG  Number :"+this.getParameter('u_remedy_num'));
    temp = temp.replace(/&lt;If there are questions, who to reach out to\?&gt;/g,"OpenedBy : "+this.getParameter('u_opened_by') +"<br\>  "+ "OpenedBy Email :  "+this.getParameter('u_opened_by_email'));
    var members=[];
    members.push(this.getParameter('u_opened_by'));
    var gr = new GlideRecord('u_cs_communications_tool');
    gr.initialize();
    gr.setValue('u_subject', this.getParameter('u_short_description') );
    gr.setValue('u_users', members);
    gr.setValue('u_content',temp);
    if(gr.insert()){
        return gr.getLink(true);
    }NativeJavaObject


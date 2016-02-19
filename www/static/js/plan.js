function showPlan(plan) {
	
}

$(document).ready(function() {
	$("#cs").jqGrid({
		url: '/test_case/package/list',
		datatype: "json",
        height: 'auto',
        colNames:['用例包','用例'],
        colModel:[
	       {name:'package',index:'invdate', width:120},
	       {name:'case',index:'case', width:240, editable:true}
	    ],
	    viewrecords: true,
		sortname: 'name',
		grouping:true,
		groupingView : {
			groupField : ['package']
		},
		caption: "计划用例",
		loadonce : true,
		multiselect: true
	});
});
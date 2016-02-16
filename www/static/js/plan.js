function showPlan(plan) {
	
}

$(document).ready(function() {
	$('#cs').treegrid({
		url:'/test_case/package/list',
		idField:'id',
		treeField:'name',
		columns:[[
		{field:'name',title:'名称',width:180},
		{field:'state',title:'选中',width:80},
		{field:'opra',title:'操作',width:80}
		]]
	});
});
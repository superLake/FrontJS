/*
 * @Author: sznews
 * @Date:   2018-12-04 10:47:04
 * @Last Modified by:   sznews
 * @Last Modified time: 2018-12-04 11:41:06
 */
$(document).ready(function() {
    $('#search').click(function() {
        var searchName = $('#Unit option:selected').text();
        var searchContent = $('#name').val();
        console.log('searchName:' + searchName + ',searchContent:' + searchContent);
        window.location.href = "http://v1.lzy.com/xysearchfront/index.htm?searchname=" + searchName + "&searchcontent=" + searchContent;
    });
})
var emtriageList = $('#emtriage-list').DataTable({
    "dom": "<'inv-list-top-section'<'row'<'col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center'l><'col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3'<'toolbar align-self-center'>>>>" +
        "<'table-responsive'tr>" +
        "<'inv-list-bottom-section d-sm-flex justify-content-sm-between text-center'<'inv-list-pages-count  mb-sm-0 mb-3'i><'inv-list-pagination'p>>",

    headerCallback:function(e, a, t, n, s) {
        e.getElementsByTagName("th")[0].innerHTML=`
        <div class="form-check form-check-primary d-block new-control">
            <input class="form-check-input chk-parent" type="checkbox" id="form-check-default">
        </div>`
    },
    columnDefs:[{
        targets:0,
        width:"30px",
        className:"",
        orderable:!1,
        render:function(e, a, t, n) {
            return `
            <div class="form-check form-check-primary d-block new-control">
                <input class="form-check-input child-chk" type="checkbox" id="form-check-default">
            </div>`
        },
    }],
    buttons: [
        {
            text: '新增檢傷',
            className: 'btn btn-primary',
            action: function(e, dt, node, config ) {
                window.location = 'index.html';
            }
        }
    ],
    "order": [[ 1, "asc" ]],
    "oLanguage": {
        "oPaginate": { "sPrevious": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' },
        "sInfo": "目前頁面 _PAGE_ / _PAGES_",
        "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        "sSearchPlaceholder": "Search...",
        "sLengthMenu": "Results :  _MENU_",
    },
    "stripeClasses": [],
    "lengthMenu": [10, 20, 50],
    "pageLength": 10
});

$("div.toolbar").html('<button class="dt-button dt-export btn btn-outline-success" tabindex="0" aria-controls="emtriage-list"><span>匯出</span></button>');

multiCheck(emtriageList);

// 匯出功能
$('.dt-export').on('click', function() {
    // 這裡可以添加匯出 PDF 的邏輯
    // 例如使用 jsPDF 或其他庫來生成 PDF
    var doc = new jsPDF(); // 假設使用 jsPDF
    doc.text('匯出資料', 10, 10);
    doc.save('data.pdf');
});

//$("div.toolbar").html('<button class="dt-button dt-delete btn btn-danger" tabindex="0" aria-controls="emtriage-list"><span>Delete</span></button>');

//multiCheck(emtriageList);


//$('.dt-delete').on('click', function() {
//       Read all checked checkboxes
//    $(".select-customers-info:checked").each(function () {
//        if (this.classList.contains('chk-parent')) {
//            return;
//        } else {
//            $(this).parents('tr').remove();
//        }
//    });
    
//})


//$('.action-delete').on('click', function() {
//    $(this).parents('tr').remove();
//})
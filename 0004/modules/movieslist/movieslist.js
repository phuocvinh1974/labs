$(document).ready(
        function () {
            function toggled(e, c) {
                if (parseInt(e.value)) {
                    e.style.color = "";
                    e.style.backgroundColor = "";
                    e.value = 0;
                } else {
                    e.style.color = "#ffffff";
                    e.style.backgroundColor = c;
                    e.value = 1;
                }
            }

            function md_status(id) {//render trang thai nut mark & disabled
                var post = {};

                post._id = id;
                $.ajax({type: "post", url: "modules/movieslist/movieslist.php?action=get-addition", data: {post: post}, success: function (r) {
                        var r = r ? JSON.parse(r) : {mark: 0, disabled: 0, popular: 0};
                        //
                        $("#btn-mark").attr({value: r.mark});
                        $("#btn-mark").css({"background-color": parseInt(r.mark) ? "#669900" : "", color: parseInt(r.mark) ? "#fff" : ""});
                        //
                        $("#btn-popular").attr({value: r.popular});
                        $("#btn-popular").css({"background-color": parseInt(r.popular) ? "#669900" : "", color: parseInt(r.popular) ? "#fff" : ""});
                        //
                        $("#btn-disabled").attr({value: r.disabled});
                        $("#btn-disabled").css({"background-color": parseInt(r.disabled) ? "#cc3300" : "", color: parseInt(r.disabled) ? "#fff" : ""});
                    }});
            }

            function newDateFrom(d) {
                var d = d.split("\/");
                return  new Date(d[2], d[1] - 1, d[0]);
            }

            function panelReset() {
                $("#txt-id,#txt-inttitle,#txt-title,#txt-runtime").val(null);
                $("#txt-releasedate").val(null);
                $("#lst-format,#lst-genres").jqxDropDownList("uncheckAll");
                $("#lst-restricted,#lst-studios,#lst-distributors").jqxDropDownList("clearSelection");
                $("#txt-storyline").empty();
            }

            var __changed = false;//bien ghi nhan su thay doi row nay sang row khac
            var __selected = false;//bien luu tru thong tin khi cell duoc chon

            var genres_src = {datatype: "json", url: "modules/common/genres-list.php", datafields: [{name: "name"}], root: "items"};
            var studios_src = {datatype: "json", url: "modules/common/studios-list.php", datafields: [{name: "name"}], root: "items"};
            var distributors_src = {datatype: "json", url: "modules/common/distributors-list.php", datafields: [{name: "name"}], root: "items"};
            var grid_movieslist_src = {datatype: "json", url: "modules/common/movies-list.php",
                datafields: [{name: "_id"},
                    {name: "IntTitle"}, {name: "Title"}, {name: "Runtime"}, {name: "Format"}, {name: "Genres"}, {name: "ReleaseDate"},
                    {name: "Studio"}, {name: "Distributor"}, {name: "Restricted"}, {name: "Storyline"}],
                root: "items"};

            // COMPONENTS
            $("#panel-L").jqxNavigationBar({width: 248, height: 562, theme: _GLOBAL.theme});
            $("#lst-format").jqxDropDownList({source: ["2D", "3D"], checkboxes: true, autoDropDownHeight: true, placeHolder: "", width: 150, height: 30, theme: _GLOBAL.theme});
            $("#txt-releasedate").jqxDateTimeInput({value: null, width: 248, height: 30, theme: _GLOBAL.theme})
            $("#lst-genres").jqxDropDownList({source: new $.jqx.dataAdapter(genres_src), displayMember: "name", width: 248, height: 30, checkboxes: true, autoDropDownHeight: true, placeHolder: "", theme: _GLOBAL.theme});
            $("#lst-studios").jqxDropDownList({source: new $.jqx.dataAdapter(studios_src), displayMember: "name", width: 248, height: 30, autoDropDownHeight: true, placeHolder: "", theme: _GLOBAL.theme});
            $("#lst-distributors").jqxDropDownList({source: new $.jqx.dataAdapter(distributors_src), displayMember: "name", width: 248, height: 30, autoDropDownHeight: true, placeHolder: "", theme: _GLOBAL.theme});
            $("#lst-restricted").jqxDropDownList({source: ["PG", "PG-13", "NC-16"], width: 248, height: 30, autoDropDownHeight: true, placeHolder: "", theme: _GLOBAL.theme});
            $("#btn-r-save,#btn-a-save,#btn-new").jqxButton({width: 100, height: 30, theme: _GLOBAL.theme})
            $("#btn-mark,#btn-popular,#btn-disabled").jqxButton({width: 100, height: 30, theme: _GLOBAL.theme});

            $("#grid-movieslist").jqxGrid({
                source: grid_movieslist_src, width: 854, height: 560,
                pageable: true, pagermode: "simple", pagesize: 20,
                filterable: true,
                showfilterrow: true,
                columns: [
                    {text: "International Title", datafield: "IntTitle", pinned: true, width: 220, align: "center"},
                    {text: "Title", datafield: "Title", width: 220, align: "center"},
                    {text: "Runtime", datafield: "Runtime", width: 80, align: "center"},
                    {text: "Format", datafield: "Format", cellsrenderer:function(row, columnfield, value, defaulthtml, columnproperties){
                            var _bgcolor = value.split(',').indexOf('3D') >= 0 ? 'background-color:#ff0;color:#000;' : '';
                            return '<span style="margin:4px;float:' + columnproperties.cellsalign + ';' + _bgcolor + '">' + value + '</span>';
                        }, width: 80, align: "center", cellsalign:"center"},
                    {text: "ReleaseDate", datafield: "ReleaseDate", cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                            return '<span style="margin:4px;float:' + columnproperties.cellsalign + '">' + new Date(value.sec * 1000).toYMDFormat() + '</span>';
                        }, width: 100, align: "center",  cellsalign:"center"},
                    {text: "Genres", datafield: "Genres", width: 150, align: "center"},
                    {text: "Studio", datafield: "Studio", width: 200, align: "center"},
                    {text: "Distributor", datafield: "Distributor", width: 150, align: "center"},
                    {text: "Restricted", datafield: "Restricted"}], theme: _GLOBAL.theme});

            // EVENTS
            $("#img-thumbnail").click(function () {
                try {
                    var movie_selected = $("#grid-movieslist").jqxGrid("getrowdata", $("#grid-movieslist").jqxGrid("getselectedrowindex"));
                    if (confirm("Upload thumbnail poster for " + movie_selected.IntTitle + "?")) {
                        $("#file-upload").click();
                    }
                } catch (e) {
                    return;
                }
            });

            $("#file-upload").on("change", function () {
                var fread = new FileReader();
                var fd = new FormData();
                var xhr = new XMLHttpRequest();
                var f = $("#file-upload")[0].files[0];
                fread.readAsDataURL(f);
                fread.onload = function (e) {
                    $("#img-thumbnail").css({"background-image": "url(" + e.target.result + ")"});
                };
                fd.append("file", f);
                fd.append("_id", $("#txt-id").val());
                xhr.open("POST", "modules/movieslist/thumb-upload.php", true);
                xhr.send(fd);
            });

            $("#grid-movieslist").on("rowselect", function (e) {

                $("#btn-r-save").val("MODIFY");
                $("#btn-a-save").val("MODIFY");

                panelReset();

                var row = $("#grid-movieslist").jqxGrid("getrowdata", e.args.rowindex);

                $("#txt-id").val(row._id.$id);
                $("#txt-inttitle").val(row.IntTitle);
                $("#txt-title").val(row.Title);
                $("#txt-runtime").val(row.Runtime);

                $.each(row.Format.split(","), function () {
                    $("#lst-format").jqxDropDownList("checkItem", this);
                });

                $("#txt-releasedate").jqxDateTimeInput("setDate", new Date(row.ReleaseDate.sec * 1000));
                //console.log(row.ReleaseDate)

                $.each(row.Genres.split(","), function () {
                    $("#lst-genres").jqxDropDownList("checkItem", this);
                });

                $("#lst-restricted").jqxDropDownList("selectItem", row.Restricted);
                $("#lst-studios").jqxDropDownList("selectItem", row.Studio);
                $("#lst-distributors").jqxDropDownList("selectItem", row.Distributor);
                $("#txt-storyline").text(row.Storyline);

                $("#img-thumbnail").css({"background-image": "url(img/movie/thumb-" + row._id.$id + ".jpg)"});

                md_status(row._id.$id);
            });

            $("#btn-new").click(function () {
                $("#btn-r-save").val("SAVE");
                $("#btn-a-save").val("SAVE");

                $("#grid-movieslist").jqxGrid("clearselection");

                panelReset();
            });

            $("#lst-studios,#lst-distributors,#lst-restricted").dblclick(function () {
                $(this).jqxDropDownList("clearSelection");
            })

            $("#btn-r-save,#btn-a-save").click(function () {
                var post = {};
                var action = "add";

                post._id = $("#txt-id").val();
                post.IntTitle = $("#txt-inttitle").val();
                post.Title = $("#txt-title").val();
                post.Runtime = $("#txt-runtime").val();
                post.Format = $("#lst-format").val();
                post.Genres = $("#lst-genres").val();
                post.ReleaseDate = $("#txt-releasedate").jqxDateTimeInput("getDate").toYMDFormat() + "T00:00:00.000Z";
                post.Restricted = $("#lst-restricted").val();
                post.Studio = $("#lst-studios").val();
                post.Distributor = $("#lst-distributors").val();
                post.Storyline = $("#txt-storyline").text();

                if ($("#txt-id").val())
                    action = "modify";

                $.ajax({type: "post", url: "modules/movieslist/movieslist.php?action=" + action, data: {post: post}, success: function (r) {
                        _GLOBAL.processes.saved = true;
                        $("#grid-movieslist").jqxGrid("updatebounddata");
                    }
                });
            });

            $("#btn-mark").click(function () {
                toggled(this, "#669900");
                var post = {};
                post._id = $("#txt-id").val();
                post.mark = this.value;
                $.ajax({type: "post", url: "/modules/movieslist/movieslist.php?action=set-mark", data: {post: post}});
            });
            $("#btn-popular").click(function () {
                toggled(this, "#669900");
                var post = {};
                post._id = $("#txt-id").val();
                post.popular = this.value;
                $.ajax({type: "post", url: "/modules/movieslist/movieslist.php?action=set-popular", data: {post: post}});
            });
            $("#btn-disabled").click(function () {
                toggled(this, "#cc3300");
                var post = {};
                post._id = $("#txt-id").val();
                post.disabled = this.value;
                $.ajax({type: "post", url: "/modules/movieslist/movieslist.php?action=set-disabled", data: {post: post}});
            });
        });

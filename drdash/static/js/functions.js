var base_url = "http://127.0.0.1:8000/";

function decrypt(text) {
    crypttext = CryptoJS.enc.Hex.parse(text);
    iv = CryptoJS.enc.Utf8.parse('phdmu5i36abu8jr4');
    key = CryptoJS.enc.Utf8.parse('vx5bwarzgm088dgz');


    var plaintextArray = CryptoJS.AES.decrypt(
        { ciphertext: crypttext },
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }
    );

    output_plaintext = CryptoJS.enc.Utf8.stringify(plaintextArray);
    output_plaintext = output_plaintext.split("@@@00@@@")[0];
    return output_plaintext;

}

//function to fetch shows(movies/series)
function fetchA(url) {
    $.ajax({
        url: url,
        dataType: "json",
        success: function (data) {
            if (!('ERROR' in data)) {
                total = data.total;
                per_page = data.per_page;
                Shows = data.Shows;
                prev = data.previous_page_url;
                next = data.next_page_url;
                current_nbr = data.current_page;
                first_page = 1;
                last_page = data.last_page;
                pagin = false;
                if (total > per_page)
                    pagin = true;
                $.each(Shows, function (index, Show) {
                    Shows[index]=decrypt(Show).replace(/: None/g,': "Null"').replace(/'/g, '"').replace('@@0@@',"'");
                    Shows[index]=JSON.parse(Shows[index]);                 
                });

                html = "";
                $.each(Shows, function (index, Show) {
                    if (Show.drama_score != "Null")
                        var score = Show.drama_score.toFixed(2);
                    else var score = "?";
                    html += '<div class="col-lg-2 col-md-3 col-sm-4 col-6 float-right">' +
                        '<div class="show">' +
                        '<div class="cover">' +
                        '<a title="' + Show.drama_name + '" href="' + Show["info-src"] + '"><img alt="' + Show.drama_name + '" src="' + Show.drama_cover_image_url + '"/></a>' +
                        '<span class="score">' + score + '<svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg></span>' +
                        '</div>' +
                        '<h3 class="text-left"><a class="title" title="' + Show.drama_name + '" href="' + Show["info-src"] + '">' + Show.drama_name + '</a></h3>' +
                        '</div>' +
                        '</div>';
                });
                $("#content").html(html);

                if (pagin == true) {
                    var pagination = '';
                    if (!url.includes("page=") && !url.includes("?")) { url += "?page=1"; }
                    else if (!url.includes("page=") && url.includes("?")) url += "&page=1";
                    if (current_nbr != 1) {
                        prev_p = current_nbr - 1;
                        pagination += '<li class="page-item">' +
                            '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + first_page) + '"><span><i class="fa fa-forward"></i></span></a>' +
                            '</li>' +
                            '<li class="page-item">' +
                            '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + prev_p) + '"><span><i class="fa fa-chevron-right"></i></span></a>' +
                            '</li>';
                    }
                    numbers = "";
                    var i = 2;
                    var array = new Array();
                    if (current_nbr - 2 > first_page) {
                        array.push('<li class="page-item">' +
                            '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + (current_nbr - i)) + '">' + (current_nbr - i) + '</a>' +
                            '</li>');
                        i++;
                        if (current_nbr + 2 > last_page) {
                            array.push('<li class="page-item">' +
                                '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + (current_nbr - i)) + '">' + (current_nbr - i) + '</a>' +
                                '</li>');
                            i++;
                        }
                        if (next == null) {
                            array.push('<li class="page-item">' +
                                '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + (current_nbr - i)) + '">' + (current_nbr - i) + '</a>' +
                                '</li>');
                            i++;
                            array = array.reverse();
                        }
                    }
                    for (i = 0; i < array.length; i++)
                        numbers += array[i];
                    if (prev != null)
                        numbers += '<li class="page-item">' +
                            '<a class="page-link" href="' + prev + '">' + (current_nbr - 1) + '</a>' +
                            '</li>';
                    numbers += '<li class="page-item pagination-active">' +
                        '<a class="page-link" href="">' + current_nbr + '</a>' +
                        '</li>';
                    if (next != null)
                        numbers += '<li class="page-item">' +
                            '<a class="page-link" href="' + next + '">' + (current_nbr + 1) + '</a>' +
                            '</li>';
                    var i = 2;
                    if (current_nbr + 2 < last_page) {
                        numbers += '<li class="page-item">' +
                            '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + (current_nbr + i)) + '">' + (current_nbr + i) + '</a>' +
                            '</li>';
                        i++;
                        if (current_nbr - 2 < first_page) {
                            numbers += '<li class="page-item">' +
                                '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + (current_nbr + i)) + '">' + (current_nbr + i) + '</a>' +
                                '</li>';
                            i++;
                        }
                        if (prev == null) {
                            numbers += '<li class="page-item">' +
                                '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + (current_nbr + i)) + '">' + (current_nbr + i) + '</a>' +
                                '</li>';
                            i++;
                        }
                    }

                    pagination += numbers;
                    if (current_nbr != last_page) {
                        next_p = current_nbr + 1;
                        pagination += '<li class="page-item">' +
                            '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + next_p) + '"><span><i class="fa fa-chevron-left"></i></span></a>' +
                            '</li>' +
                            '<li class="page-item">' +
                            '<a class="page-link" href="' + url.replace(new RegExp("page=[0-9]+", "gm"), "page=" + last_page) + '"><span><i class="fa fa-backward"></i></span></a>' +
                            '</li>';
                    }

                    $("#pagination").html(pagination);

                    $(".page-link").on("click", function (e) {
                        e.preventDefault();
                        fetchA($(this).attr("href"));
                    });
                }
                else {
                    $("#pagination").html("");
                }
            }
            else {
                html = '<div class="container" id="message">' +
                    '<div role="alert" class="alert alert-danger text-center">' +
                    '   لا يوجد نتائج' +
                    '</div>' +
                    '</div>';
                $("#content").html(html);
                $("#pagination").html("");
            }
        }
    });
}

//function fetch args from dropdowns and category buttons
function fetch_Args() {
    var order = $('#order').find(":selected").val();
    var type = $('#type').find(":selected").val();
    var stat = $('#stat').find(":selected").val();
    var cat = "";
    if (order == "year") {
        order = "1";
    }
    else if (order == "alphabet") {
        order = "0";
    }
    else if (order == "rate") {
        order = "2";
    }

    if (type == "all") {
        type = "all";
    }
    else if (type == "0") {
        type = "0";
    }
    else if (type == "1") {
        type = "1";
    }

    if (stat == "all") {
        stat = "all";
    }
    else if (stat == "0") {
        stat = "1";
    }
    else if (stat == "1") {
        stat = "0";
    }

    $(".clicked").each(function (index, element) {
        if (cat == "")
            cat += "" + element.children[0].children[0].value;
        else cat += "_" + element.children[0].children[0].value;;
    });
    return "?order=" + order + "&type=" + type + "&stat=" + stat + "&tags=" + cat;
}

function fetchI() {
    url = window.location.href;
    res = url.match(/show-([0-9]+)/g);
    res = res[0].replace("show-", "");
    $.ajax({
        url: base_url + "api/info/" + res,
        dataType: "json",
        success: function (data) {
            $.each(data.EPS,function(i,v)
            {
                data.EPS[i]=decrypt(data.EPS[i]).replace(/'/g, '"');
                data.EPS[i]=JSON.parse(data.EPS[i]); 
                //console.log(data.EPS[i]);
            });
            //console.log(data.EPS);
            $.each(data.show,function(i,v){
                data.show[i]=decrypt(data.show[i]).replace(/: None/g,': "Null"').replace(/'/g, '"').replace('@@0@@',"'");
                data.show[i]=JSON.parse(data.show[i]);
            });
 //           console.log(data.show);
            Show = data.show[0];
            Eps = data.EPS;
            Cat = Show.drama_genres;
            type = Show.drama_type;
            stat = Show.drama_status;
            if (type == "Movie") {
                type = "فلم";
            }
            else if (type == "Series") {
                type = "سلسلة";
            }
            if (stat == "Completed") {
                stat = "مكتمل";
            }
            else if (stat = "Ongoing") {
                stat = "مستمر";
            }
//            console.log(Show.drama_score);
            if (Show.drama_score=="Null")
            {score='0';}
            else {score=Show.drama_score;}
            Cat_html = "";
            episodes = '<div class="list-group text-right">';
            Cat = Cat.split(", ");
            $.each(Cat, function (index, cat) {
                Cat_html += '<a class="as-tag"> ' + cat + ' </a>';
            });
            $("h1").html(Show.drama_name);
            //$(".head-bg").css("background", "url("+Show.")");
            $(".cover").html('<img class="cover-img" alt="' + Show.drama_name + '" src="' + Show.drama_cover_image_url + '">');
            $('.as-show-story').html(Show.drama_description);
            $(".as-tags.d-none.d-sm-block").html(Cat_html);
            $("#score").html('<small class="float-right">التقييم</small>' +
                +score + '<svg width="15px" height="15px" viewBox="0 0 24 24"><path fill="yellow" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>');
            $("#eps_nbr").html('<small class="float-right">عدد الحلقات</small>' + Show.show_episode_count);
            $("#type").html('<small class="float-right">النوع</small>' + type);
            $("#r_date").html('<small class="float-right">تاريخ الصدور</small>' + Show.drama_release_date);
            $("#stat").html('<small class="float-right">الحالة</small>' + stat);
            if (Show.drama_type == "Movie") {
                episodes += '<a class="list-group-item" href="' + Eps[0]["info-src"] + '">' + Eps[0].episode_name + '</a></div>';
            }
            else {
                $.each(Eps, function (index, value) {
                    episodes += '<a class="list-group-item" href="' + Eps[index]["info-src"] + '">' + Eps[index].episode_name + '</a>';
                });
                episodes += "</div>";
            }
            $("#episodes-list").html(episodes);

        }
    });
}

function fetchW() {
    url = window.location.href;
    id = url.match(/watch-([0-9]+)/g);
    ep_n = url.match(/\/([0-9]+)/g);
    id = id[0].replace("watch-", "");
    ep_n = ep_n[ep_n.length - 1].replace("/", "");
    $.ajax({
        url: base_url + "api/watch/" + id + "/" + ep_n,
        dataType: "json",
        success: function (data) {
            if (!('ERROR' in data)){
            $.each(data.ep_info,function(i,v){
                data.ep_info[i]=decrypt(data.ep_info[i]).replace(/: None/g,': "Null"').replace(/'/g, '"').replace('@@0@@',"'");
                data.ep_info[i]=JSON.parse(data.ep_info[i]);
            });
            $.each(data.eps_urls,function(i,v){
                data.eps_urls[i]=decrypt(data.eps_urls[i]).replace(/: None/g,': "Null"').replace(/'/g, '"').replace('@@0@@',"'");
                data.eps_urls[i]=JSON.parse(data.eps_urls[i]);
            });
            $.each(data.show_info,function(i,v){
                data.show_info[i]=decrypt(data.show_info[i]).replace(/: None/g,': "Null"').replace(/'/g, '"').replace('@@0@@',"'");
                data.show_info[i]=JSON.parse(data.show_info[i]);
            });
//            console.log(data);
            ep_info = data.ep_info[0];
            eps_urls = data.eps_urls;
            show_info = data.show_info[0];
            ep_index = 0;
            servers = '';
            eps = '';
            type = "";
            score = "";
            if (ep_info.episode_name.includes("الموسم")) {
                type = "سلسلة";
            } else {
                type = "فلم";
            }
            if (show_info.drama_score == "Null") {
                score = "?";
            }
            else {
                score = show_info.drama_score;
            }
            i = 1;
            $.each(ep_info.stream_servers,function(vv,vvv){
                servers += '<option value="'+i+'">server 0' + i + '</option>'; i++;
            });
            if (type != "فلم" && eps_urls.length != 1) {
                $.each(eps_urls, function (index, ep) {
                    if (ep.episode_number == ep_n) {
                        ep_index = index;
                    }
                    eps += '<a class="list-group-item" href="' + ep.watch_url + '">' + ep.episode_name + '</a>';
                });
                $('.col-12.order-1.col-lg-9.order-lg-2').html('<iframe id="video" style="z-index:1000;background-color:black !important;" src="" scrolling="no" marginwidth="0" name="FRAME1" marginheight="0" allowfullscreen="" width="99%" height="99%" frameborder="0"></iframe>');
            }
            else {
                $.each(eps_urls, function (index, ep) {
                    if (ep.episode_number == ep_n) {
                        ep_index = index;
                    }
                });
                $('#episodes-list').addClass("d-none");
                $('.col-12.order-1.col-lg-9.order-lg-2').attr("class", "embed-responsive embed-responsive-16by9 pt-4");
                $('.embed-responsive.embed-responsive-16by9.pt-4').html('<iframe id="video" style="z-index:1000;background-color:black !important;" src="" scrolling="no" marginwidth="0" name="FRAME1" marginheight="0" allowfullscreen="" width="99%" height="99%" frameborder="0"></iframe>');
            }
            $("#breadcrumb_1").text(ep_info.drama_name);
            $("#breadcrumb_1").attr("href", show_info.info_url);
            $("#breadcrumb_2").html('&nbsp;&nbsp;' + ep_info.drama_name + " " + ep_info.episode_name + " مترجم ");
            $("h1.all-page-title").html('<span class=""><span class="title-show-name">' + ep_info.drama_name + '</span>' + ep_info.episode_name + '</span>');
            $("#server").html(servers);
            $('#eps').html(eps);
            $('#title').text(ep_info.drama_name);
            $('#title').attr("href", show_info.info_url);
            $('#type').html(type);
            $('#score').html(score + '<svg width="15px" height="15px" viewBox="0 0 24 24"><path fill="yellow" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>');
            $('#cover').attr("src", show_info.drama_cover_image_url);

            var next = eps_urls[ep_index + 1];
            var prev = eps_urls[ep_index - 1];
            if (next != undefined) {
                $(".col-12.col-md-4.float-right").append('<div id="next-eps" class="float-right last-next-ep">' +
                    '<a href="' + next.watch_url + '"><svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>الحلقة التالية</a>' +
                    '</div>');
            }
            if (prev != undefined) {
                $(".col-12.col-md-4.float-right").append('<div id="prev-eps" class="float-left last-next-ep">' +
                    '<a href="' + prev.watch_url + '">الحلقة السابقة <svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg></a>' +
                    '</div>');
            }
            server_d = $('#server').find(":selected").val();
            
            server_d = ep_info.stream_servers[server_d-1];
            $('#video').attr('src', server_d);

            $('option').on("click", function () {
                server_d = $('#server').find(":selected").val();
                $.ajax({
                    url: base_url + "api/watch/" + id + "/" + ep_n,
                    dataType: "json",
                    success: function (data) {
                        $.each(data.ep_info,function(i,v){
                            data.ep_info[i]=decrypt(data.ep_info[i]).replace(/: None/g,': "Null"').replace(/'/g, '"').replace('@@0@@',"'");
                            data.ep_info[i]=JSON.parse(data.ep_info[i]);
                        });
                        server_d = data.ep_info[0].stream_servers[server_d-1];
                        $('#video').attr('src', server_d);
                    }
                });

            });


        }else {
            $('.col-12.order-1.col-lg-9.order-lg-2').before('<p style="font-family: \'Droid Arabic Kufi\';color:red;text-align:center;">لا يوجد روابط لهذه الحلقة.</p>');
            $('.col-12.order-1.col-lg-9.order-lg-2').attr("class", "embed-responsive embed-responsive-16by9 pt-4");
            $('.embed-responsive.embed-responsive-16by9.pt-4').html('<iframe id="video" style="z-index:1000;background-color:black !important;" src="" scrolling="no" marginwidth="0" name="FRAME1" marginheight="0" allowfullscreen="" width="99%" height="99%" frameborder="0"></iframe>');
        }
    }
    });
}

function init_Search() {

    q = $("#search-input").val();
    $.ajax({
        url: base_url + "api/search?q=" + q,
        dataType: "json",
        success: function (data) {
            $('#search_div').remove();
            res = "";
            res += '<div id="search_div" class="results text-left" style="">';
            if (!('Search Resaults' in data)) {
                if (data["SearchResaults"] != "NO RESAULT" && data["SearchResaults"] != "MIN. 3 CHARACTERS") {
//                    console.log(data);
                    $.each(data["SearchResaults"],function(i,v)
                    {
                        data["SearchResaults"][i]=decrypt(data["SearchResaults"][i]).replace(/: None/g,': "Null"').replace(/'/g, '"').replace('@@0@@',"'");
                        data["SearchResaults"][i]=JSON.parse(data["SearchResaults"][i]);
                    });
                    $.each(data["SearchResaults"], function (index, search_res) {
                        if (search_res.drama_type == "Movie")
                            type = "فلم";
                        else type = "سلسلة";
                        res += '<a style="box-shadow: 0 2px 5px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);" class="result" href="' + search_res.info_url + '"><img src="' + search_res.drama_cover_image_url + '">' +
                            '<div class="content-search">' +
                            '<div class="title">' + search_res.drama_name + '</div>' +
                            '<div style="color:#808080" class="date">' + type + '، ' + search_res.drama_release_date + '</div>' +
                            '</div>' +
                            '</a>';
                    });
                    res += "</div>";
                    $("#search_bar").append(res);
                    $('body').on('click', function (e) {
                        itis = false;
                        x = e.target.parentNode;
                        if (e.target.parentNode.id == "search_bar")
                            itis = true;
                        while (x = x.parentNode) {
                            if (x.id == "search_bar") itis = true;
                        }
                        if (!itis) {
                            $('#search_div').remove();
                            $('#search-input').val("");
                        }
                    });

                }
            } else if (data["Search Resaults"] == "MIN. 3 CHARACTERS") {
                res += '<a dir="rtl" style="box-shadow: 0 2px 5px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);" class="result text-center">' +
                    '<div dir="rtl" class="title">الرجاء إدخال أكثر من 3 حروف</strong></div>' +
                    '</a></div>';
                $("#search_bar").append(res);
                $('body').on('click', function (e) {
                    itis = false;
                    x = e.target.parentNode;
                    if (e.target.parentNode.id == "search_bar")
                        itis = true;
                    while (x = x.parentNode) {
                        if (x.id == "search_bar") itis = true;
                    }
                    if (!itis) {
                        $('#search_div').remove();
                        $('#search-input').val("");
                    }
                });
            } else if (data["Search Resaults"] == "NO RESAULT") {
                res += '<a dir="rtl" style="box-shadow: 0 2px 5px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);" class="result text-center">' +
                    '<div dir="rtl" class="title">لا يوجد نتائج ل : <strong style="color:#e50914" >' + q + '</strong></div>' +
                    '</a></div>';
                $("#search_bar").append(res);
                $('body').on('click', function (e) {
                    itis = false;
                    x = e.target.parentNode;
                    if (e.target.parentNode.id == "search_bar")
                        itis = true;
                    while (x = x.parentNode) {
                        if (x.id == "search_bar") itis = true;
                    }
                    if (!itis) {
                        $('#search_div').remove();
                        $('#search-input').val("");
                    }
                });
            }
        }
    });
}
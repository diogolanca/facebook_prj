$(document).ready(function(){
    $("#post-form").submit(function(e) {
        e.preventDefault();
        let post_caption = $("#post-caption").val();
        let post_visibility = $("#visibility").val();

        let fileInput = $("#post-thumbnail")[0];
        let file = fileInput.files[0];
        let fileName = file.name;
        let formData = new FormData();
        formData.append("post-caption", post_caption);
        formData.append("post-thumbnail", file, fileName);
        formData.append("visibility", post_visibility);

        $.ajax({
            url: "/create_post/",
            type: "POST",
            dataType:"json",
            data: formData,
            processData:false,
            contentType:false,

            success: function(res) {
                console.log(res)
                let _html = '<div class="card lg:mx-0 uk-animation-slide-bottom-small mt-3 mb-3">\
                    <div class="flex justify-between items-center lg:p-4 p-2.5">\
                        <div class="flex flex-1 items-center space-x-4">\
                            <a href="#">\
                                <img src="' + res.post.profile_image + '" style="width: 40px; height: 40px;" class="bg-gray-200 border border-white rounded-full w-10 h-10" />\
                            </a>\
                            <div class="flex-1 font-semibold capitalize">\
                                <a href="#" class="text-black dark:text-gray-100">' + res.post.full_name + '</a>\
                                <div class="text-gray-700 flex items-center space-x-2">' + res.post.date + ' ago \
                                    <ion-icon name="story-time"></ion-icon>\
                                </div>\
                            </div>\
                        </div>\
                        <div>\
                            <a href="#"> <i class="icon-feather-more-horizontal text-2xl hover:bg-gray-200 rounded-full p-2 transition -mr-1 dark:hover:bg-gray-700"></i> </a>\
                            <div class="bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden text-base border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700" uk-drop="mode: click;pos: bottom-right;animation: uk-animation-slide-bottom-small">\
                                <ul class="space-y-1">\
                                    <li>\
                                        <a href="#" class="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800">\
                                    <i class="uil-share-alt mr-1"></i> Share\
                                    </a>\
                                    </li>\
                                    <li>\
                                        <a href="#" class="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800">\
                                    <i class="uil-edit-alt mr-1"></i>  Edit Post \
                                    </a>\
                                    </li>\
                                    <li>\
                                        <a href="#" class="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800">\
                                    <i class="uil-comment-slash mr-1"></i>   Disable comments\
                                    </a>\
                                    </li>\
                                    <li>\
                                        <a href="#" class="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800">\
                                    <i class="uil-favorite mr-1"></i>  Add favorites \
                                    </a>\
                                    </li>\
                                    <li>\
                                        <hr class="-mx-2 my-2 dark:border-gray-800">\
                                    </li>\
                                    <li>\
                                        <a href="#" class="flex items-center px-3 py-2 text-red-500 hover:bg-red-100 hover:text-red-500 rounded-md dark:hover:bg-red-600">\
                                    <i class="uil-trash-alt mr-1"></i>  Delete\
                                    </a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    </div>\
                    <div uk-lightbox>\
                            <div class="p-5 pt-0 border-b dark:border-gray-700 pb-3">\
                                ' + res.post.title + '\
                            </div>\
                        <div class="grid grid-cols-2 gap-2 px-5">\
                            <!-- Show thumnnail -->\
                            <a href="' + res.post.image_url + '" class="col-span-2">  \
                                <img src="' + res.post.image_url + '" style="width: 100%; height: 300px; object-fit: cover;" alt="" class="rounded-md w-full lg:h-76 object-cover">\
                            </a>\
                        </div>\
                    </div>\
                    <div class="p-4 space-y-3">\
                        <div class="flex space-x-4 lg:font-bold">\
                            <a style="cursor: pointer;" class="flex items-center space-x-2">\
                                <div class="p-2 rounded-full like-btn' + res.post.id + ' {% if request.user in p.likes.all %} text-blue-500 {% else %} text-black {% endif %}" id="like-btn" data-like-btn="' + res.post.id + '">\
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="22" height="22" class="dark:text-gray-100">\
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />\
                                    </svg>\
                                </div>\
                                <div> Like</div>\
                            </a>\
                            <a href="#" class="flex items-center space-x-2">\
                                <div class="p-2 rounded-full  text-black lg:bg-gray-100 dark:bg-gray-600">\
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="22" height="22" class="dark:text-gray-100">\
                                        <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" />\
                                    </svg>\
                                </div>\
                                <div><span id="comment-count' + res.post.id + '">0</span> Comment</div>\
                            </a>\
                            <a href="#" class="flex items-center space-x-2 flex-1 justify-end">\
                                <div class="p-2 rounded-full  text-black lg:bg-gray-100 dark:bg-gray-600">\
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="22" height="22" class="dark:text-gray-100">\
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />\
                                    </svg>\
                                </div>\
                                <div> Share</div>\
                            </a>\
                        </div>\
                        <div class="flex items-center space-x-3 pt-2">\
                            <div class="dark:text-gray-100">\
                                <strong> <span id="like-count' + res.post.id + '">{{p.likes.all.count}}</span></strong> Likes\
                            </div>\
                        </div>\
                        <div class="bg-gray-100 rounded-full relative dark:bg-gray-800 border-t">\
                            <input placeholder="Add your Comment.." id="comment-input' + res.post.id + '" data-comment-input="' + res.post.id + '" class="bg-transparent max-h-10 shadow-none px-5 comment-input' + res.post.id + '">\
                            <div class="-m-0.5 absolute bottom-0 flex items-center right-3 text-xl">\
                                {% comment %}<a href="#">\
                                    <ion-icon name="happy-outline" class="hover:bg-gray-200 p-1.5 rounded-full"></ion-icon>\
                                </a>\
                                <a href="#">\
                                    <ion-icon name="image-outline" class="hover:bg-gray-200 p-1.5 rounded-full"></ion-icon>\
                                </a>{% endcomment %}\
                                <a style="cursor: pointer;" id="comment-btn" class="comment-btn' + res.post.id + '" data-comment-btn="' + res.post.id + '">\
                                    <ion-icon name="send" class="hover:bg-gray-200 p-1.5 rounded-full"></ion-icon>\
                                </a>\
                            </div>\
                        </div>\
                    </div>\
                    ';
                
                $(".post-div").prepend(_html);
                $("#create-post-modal").removeClass("uk-flex uk-open");
                $("#post-caption").val("");
                $("#visibility").val("");
                $("#post-thumbnail").val("");
            }
        })
    })

    // like post
    $(document).on("click", "#like-btn", function(){
            let btn_val = $(this).attr("data-like-btn");
            $.ajax({
                url: "/like_post/",
                dataType: "json",
                data: {
                    "id": btn_val
                },
                success: function(res){
                    $("#like-count"+ btn_val).text(res.data.likes);
                    if (res.data.bool === true){
                        $(`.like-btn${btn_val}`).addClass("text-blue-500");
                        $(`.like-btn${btn_val}`).removeClass("text-black");
                    } else {
                        $(`.like-btn${btn_val}`).addClass("text-black");
                        $(`.like-btn${btn_val}`).removeClass("text-blue-500");
                    }
                }
            })
        })

    // Comment on post
    $(document).on("click", "#comment-btn", function(){
        let id = $(this).attr("data-comment-btn")
        let comment = $("#comment-input"+id).val()
        console.log(id);
        console.log(comment);
        $.ajax({
            url: "/comment_post/",
            dataType: "json",
            data: {
                "id": id,
                "comment": comment,
            },
            success: function (resp){
                console.log(resp);
                let newComment = '<div class="flex card shadow p-2">\n' +
                                            '<div class="w-10 h-10 rounded-full relative flex-shrink-0">\n' +
                                                '<img src="' + resp.data.profile_image + '" alt="" class="absolute h-full rounded-full w-full">\n' +
                                            '</div>\n' +
                                            '<div>\n' +
                                                '<div class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 relative lg:ml-5 ml-2 lg:mr-12  dark:bg-gray-800 dark:text-gray-100">\n' +
                                                    '<p class="leading-6">' + resp.data.comment + '\n' +
                                                    '<div class="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800"></div>\n' +
                                                    '</div>\n' +
                                                '<div class="text-sm flex items-center space-x-3 mt-2 ml-5">\n' +
                                                    '<a id="like-comment-btn" style="cursor: pointer; color: gray" data-like-comment="' + id + '" class="like-comment' + id + '"> <i class="fa-solid fa-heart"></i> </a> <small><span id="comment-likes-count' + id + '">0</span></small>\n' +
                                                    '<details >\n' +
                        '                               <summary>\n' +
                        '                                   <div class="">Reply</div>\n' +
                        '                               </summary>\n' +
                        '                               <details-menu role="menu" class="origin-topf-right relative right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">\n' +
                        '                               <div class="pyf-1" role="none">\n' +
                            '                               <div class="p-1 d-flex">\n' +
                            '                                   <input type="text" placeholder="Write Reply" class="with-border" name="" id="reply-input' + id + '">\n' +
                        '                                       <button id="reply-comment-btn" data-reply-comment-btn="' + id + '" type="submit" class="reply-comment-btn' + id + ' block w-fulfl text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">\n' +
                        '                                       <ion-icon name="send"></ion-icon>\n' +
                        '                                       </button>\n' +
                        '                                    </div>\n' +
                        '                                </div>\n' +
                        '                            </details-menu>\n' +
                        '                        </details>' +
                                                 '<span> ' + resp.data.date + ' </span>\n' +
                                            '</div>\n' +
                                        '</div>\n' +
                                    '</div>';
                $("#comment-div" + id).prepend(newComment);
                $("#comment-input" + id).val("");
                $("#comment-count" + id).text(resp.data.comment_count);
            }
        })
    })

    // Like Comment
    $(document).on("click", "#like-comment-btn", function (){
        let id = $(this).attr("data-like-comment")
        console.log("comment id: ", id);

        $.ajax({
            url: "/like_comment/",
            dataType: "json",
            data: {
                "id": id
            },
            success: function (resp){
                console.log(resp.data);
                    $("#comment-likes-count"+id).text(resp.data.likes)
                if (resp.data.bool === true){
                    $(".like-comment"+id).css("color", "red")
                } else {
                    $(".like-comment"+id).css("color", "grey")

                }
            }
        })
    })

    $(document).on("click", "#reply-comment-btn", function (){
        let id = $(this).attr("data-reply-comment-btn")
        let reply = $("#reply-input"+id).val()

        $.ajax({
            url: "/reply_comment/",
            dataType: "json",
            data: {
                "id": id,
                "reply": reply
            },
            success: function (resp){
                let newReply = '<div class="flex mr-12 mb-2 mt-2" style="margin-right: 20px;">\n' +
                    '<div class="w-10 h-10 rounded-full relative flex-shrink-0">\n' +
                    '    <img src="' + resp.data.profile_image + '" style="width: 40px; height: 40px;" alt="" class="absolute h-full rounded-full w-full">\n' +
                    '        </div>\n' +
                    '        <div>\n' +
                    '            <div class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 relative lg:ml-5 ml-2 lg:mr-12 dark:bg-gray-800 dark:text-gray-100">\n' +
                    '                <p class="leading-6">' + resp.data.reply + '</p>\n' +
                    '                <div class="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800"></div>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '</div>'
                $(".reply-div"+id).prepend(newReply);
                $("#reply-input"+id).val("")
            }
        })
    })

    // Delete Comment
    $(document).on("click", "#delete-comment", function (){
        let id = $(this).attr("data-delete-comment")
        console.log(id)

        $.ajax({
            url: "/delete_comment/",
            dataType: "json",
            data: {
                "id": id
            },
            success: function (response){
                console.log("Comment ", id, " Deleted");
                $("#comment-div"+id).addClass("d-none")
            }
        })
    })

    // Add Friend
    $(document).on("click", "#add-friend", function (){
        let id = $(this).attr("data-friend-id")
        console.log("Added " + id + " as a Friend");

        $.ajax({
            url: "/add_friend/",
            dataType: "json",
            data: {
                "id": id
            },
            success: function (resp){
                console.log(resp);
                if (resp.bool === true){
                    $("#friend-text").html('<i class="fas fa-user-minus"></i> Cancel Request')
                    $(".add-friend"+id).addClass("bg-red-600")
                    $(".add-friend"+id).removeClass("bg-blue-600")
                }
                if (resp.bool === false){
                    $("#friend-text").html('<i class="fas fa-user-plus"></i> Add Friend')
                    $(".add-friend"+id).addClass("bg-blue-600")
                    $(".add-friend"+id).removeClass("bg-red-600")
                }
            }
        })
    })

    // Accept Friend Request
    $(document).on("click", "#accept-friend-request", function (){
        let id = $(this).attr("data-request-id");
        console.log(id);

        $.ajax({
            url: "/accept_friend_request/",
            dataType: "json",
            data: {
                "id": id
            },
            success: function (resp){
                console.log(resp);
                $(".reject-friend-request-hide"+id).hide()
                $(".accept-friend-request"+id).html('<i class="fas fa-check-circle"></i> Friend Request Accepted')
            }
        })
    })

    // Reject Friend Request
    $(document).on("click", "#reject-friend-request", function (){
        let id = $(this).attr("data-request-id");
        console.log(id);

        $.ajax({
            url: "/reject_friend_request/",
            dataType: "json",
            data: {
                "id": id
            },
            success: function (resp){
                console.log(resp);
                $(".accept-friend-request-hide"+id).hide()
                $(".reject-friend-request"+id).html('<i class="fas fa-check-circle"></i> Friend Request Rejected')
            }
        })
    })

    // Unfriend
    $(document).on("click", "#unfriend", function (){
        let id = $(this).attr("data-unfriend")
        console.log(id);

        $.ajax({
            url: "/unfriend/",
            dataType: "json",
            data: {
                "id": id
            },
            success: function (resp){
                console.log(resp);
                $("#unfriend-text").html('<i class="fas fa-check-circle"></i> Friend Removed')
                $(".unfriend"+id).addClass("bg-green-600")
                $(".unfriend"+id).removeClass("bg-red-600")
            }
        })
    })

    // Block User
    $(document).on("click", '#block-user-btn', function(){
        let id = $(this).attr("data-block-user");
        
        $.ajax({
            url:"/block_user/",
            dataType:"json",
            beforeSend: function(){
                $("#block-user-btn").html("<i class='fas fa-spinner fa-spin'></i>")
            },
            data: {
                "id":id
            },
            success: function(response) {
                console.log(response);
                $(".block-text"+id).html("<i class='fas fa-check-circle'></i> User Blocked")
            }
        })
        
    })
})
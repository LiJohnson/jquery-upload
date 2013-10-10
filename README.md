jquery-upload
====================

case 1:jquery+iframe=upload
case 2:jquery+XMLHttpRequestUpload=upload

example
$("input:file").uploadFile("upload_url" , function(data){
    alert("uploaded");/* response && do something*/
    }
    ,"html"); /*type,default is 'json'*/
});

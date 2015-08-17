
var src = require('./sf.jpg'), 
 srcset = require('../index?sizes[]=200w,sizes[]=400w,sizes[]=900w!./sf.jpg');
 blur = require('../index?placeholder!./sf.jpg');

var j = document.createElement("img");
j.setAttribute('src', blur);
j.style.position = "absolute"
j.style.top = 0;
j.style.left = 0;
j.style.transition = "opacity 5s";
j.style.width = '100%';
j.id = 'placeholder';
document.body.appendChild(j);


var i = document.createElement("img");
i.setAttribute('src', src);
i.style.position = "absolute"
i.style.top = 0;
i.style.left = 0;
i.style.transition = "opacity 2s";
i.style.width = '100%'
i.style.opacity = 0;
i.setAttribute('srcset', srcset);
i.onload = function(){
  i.style.opacity = 1;
  j.style.opacity = 0;
}
document.body.appendChild(i);

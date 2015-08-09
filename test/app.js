function img(src, srcset) {
  var i = document.createElement("img");
  i.setAttribute('src', src);
  if (srcset){
    i.setAttribute('srcset', srcset);
  }
  document.body.appendChild(i);
}
function p(inner){
  var p = document.createElement("p");
  p.innerHTML = inner;
  document.body.appendChild(p);
}

p('Create multiple images and the browser will load the right one for the screen size & density.');
img('./sf.jpg', require('../index?sizes[]=200w,sizes[]=400w,sizes[]=900w!./sf.jpg'));

p('Optionally create a small datauri placeholder image first.');
img(require('../index?placeholder=50!./sf.jpg'));

p('Adjust the size and blur of the placeholder image.');
img(require('../index?placeholder=500&blur=3!./sf.jpg'));

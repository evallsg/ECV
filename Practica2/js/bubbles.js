class Bubbles {

    constructor(parent_node) {
        //var miniSpheres= [];

        this.mouseX = 0,
        this.mouseY = 0;

        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.parent_node = parent_node;

        this.bubblesInitialized = false;

        this.syncClient = new SyncClient(this);

        this.syncClient.server.on_room_info = this.onSyncClientReady.bind(this);
        this.spheres=[];

        this.scene = new THREE.Scene();
        this.setText.bind(this)
        this.materials = [];
        this.textures = [];
       /* this.url = "https://cdn.pixabay.com/photo/2016/11/01/21/11/avatar-1789663_960_720.png";
        this.userTexture = new THREE.TextureLoader().load( this.url );
        /*userTexture.wrapS = THREE.RepeatWrapping;
        userTexture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );*/
    }

}

Bubbles.prototype.onBubblesLoaded = function() {
    this.onBubblesLoaded = true;
   /* var loader = new THREE.FontLoader();
    loader.load( 'helvetiker_regular.typeface.json',function ( font ) {
         this.setText('hola',[Math.random() * 10000 - 5000, Math.random() * 10000 - 5000, Math.random() * 10000 - 5000], font).bind(this)
    })*/

    var path = "imgs/";
    var format = '.png';

    var urls = [
        path + 'TropicalSunnyDayBack' + format, path + 'TropicalSunnyDayFront' + format,
        path + 'TropicalSunnyDayUp' + format, path + 'TropicalSunnyDayDown' + format,
        path + 'TropicalSunnyDayLeft' + format, path + 'TropicalSunnyDayRight' + format
    ];
    
    var textureCube=this.loadTexture(urls);
//    this.scene = new THREE.Scene();
    this.scene.background = textureCube;

    var bubbleGeometry = new THREE.SphereGeometry(100, 32, 16);
    
    //var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    //uniforms[ "tCube" ].value = textureCube;

    this.loadMaterial("bubble");  

   //this.spheres = []
    //var nBubbles = this.positions[0]== undefined ? 20 : this.positions.length
    
    for (var i = 0; i < this.positions.length; i++) {

            
        var mesh = new THREE.Mesh(bubbleGeometry, this.materials['bubble']);

        mesh.position.x = this.positions[i]["x"];
        mesh.position.y = this.positions[i]["y"];
        mesh.position.z = this.positions[i]["z"];

        mesh.scale.x = mesh.scale.y = mesh.scale.z = this.scaling[i];

        this.scene.add(mesh);
        this.spheres.push(mesh);

    }

    this.scene.matrixAutoUpdate = false;
    //
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    //

    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    document.addEventListener( 'mousewheel', this.onDocumentMouseWheel.bind(this), false );
    document.querySelector("#new-bubble").addEventListener("click", this.addBubble.bind(this), false);
  
    this.animate();
}
Bubbles.prototype.loadMaterial= function (url){
    if(this.materials[url]){
        return this.materials[url];
    }
    var path = "imgs/";
    var format = '.png';

    var urls = [
        path + 'TropicalSunnyDayBack' + format, path + 'TropicalSunnyDayFront' + format,
        path + 'TropicalSunnyDayUp' + format, path + 'TropicalSunnyDayDown' + format,
        path + 'TropicalSunnyDayLeft' + format, path + 'TropicalSunnyDayRight' + format
    ];
    var textureCube =   this.loadTexture(urls);
   
    var bubbleShader = THREE.FresnelShader;
    var material = new THREE.ShaderMaterial({
        uniforms: {

            "mRefractionRatio": { value: 1.02 },
            "mFresnelBias": { value: 0.1 },
            "mFresnelPower": { value: 2.0 },
            "mFresnelScale": { value: 1.0 },
            "tCube": { value: textureCube }

        },
        vertexShader: bubbleShader.vertexShader,
        fragmentShader: bubbleShader.fragmentShader
    });
    this.materials['bubble']= material;
}
Bubbles.prototype.loadTexture = function (urls){
    if(this.textures[urls]){
        return this.textures[urls];
    }
    var textureCube = new THREE.CubeTextureLoader().load(urls);
    textureCube.format = THREE.RGBFormat;
    this.textures[urls] = textureCube;
    return textureCube
}
Bubbles.prototype.onBubblesPositionRequest = function(){
    if(this.isHost)
    {
    	var positions = [];
    	var scaling = [];
    	for(var idx = 0; idx < this.spheres.length; idx++)
    	{
    		positions.push(this.spheres[idx].position);
    		scaling.push(this.spheres[idx].scale["x"]);
    	}

        this.syncClient.sendBubblesPosition(positions, scaling);
    }
}

Bubbles.prototype.onBubblesPositionReceived = function(bubbles_attributes){
    if(!this.bubblesInitialized)
    {
        this.positions = bubbles_attributes["positions"];
        this.scaling = bubbles_attributes["scaling"];
        this.onBubblesLoaded();
    }
}

Bubbles.prototype.onSyncClientReady = function(){
    this.init(this.parent_node);
}

Bubbles.prototype.init = function(parent_node) {
    
    this.syncClient.checkIfHost(); 
    
    this.container = document.createElement('div');
    document.querySelector(parent_node).appendChild(this.container);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
    this.camera.position.z = 3200;
    //if we are the host, we compute the positions of the bubbles
    this.positions = []
    this.scaling = []
    if(this.isHost)
    {   
        for (var i = 0; i < 20; i++)
        {
            this.positions.push({"x": Math.random() * 10000 - 5000, "y": Math.random() * 10000 - 5000, "z": Math.random() * 10000 - 5000})
            this.scaling.push(Math.random() * 3 + 1);
        }
        this.bubblesInitialized = true;
        this.onBubblesLoaded();
    }
    else
    {
        this.syncClient.getBubblesPosition();
    }       

}

Bubbles.prototype.onWindowResize = function() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

}

Bubbles.prototype.onMouseDown = function(event) {
    var timer = 0.0001 * Date.now();
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();

    raycaster.setFromCamera(mouse, this.camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(this.spheres);

    //for (var i = 0; i < intersects.length; i++) {
        
        //var basicMaterial = new THREE.MeshBasicMaterial( { color: 0xfff000, opacity: 0, wireframe: true } );
    if(intersects[0]!=undefined){
        var object = intersects[0].object;

        this.syncClient.sendExplodePosition(object.position);
        this.explode(object)
    }
        
       // this.addUserBubble(object.position)
        

   // }

}
/*Bubbles.prototype.addUserBubble = function(position) {
    var texture = new THREE.TextureLoader( this.url )
    console.log(texture)
    texture.needsUpdate = true
        var material = new THREE.MeshPhongMaterial( {
        color: 0xffffff, 
        specular: 0x050505,
        shininess: 50,
        map: texture
    } );
        var geometry = new THREE.SphereGeometry(100, 32, 16);
    var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
    for ( i = 0; i < faceVertexUvs.length; i ++ ) {

        var uvs = faceVertexUvs[ i ];
        var face = geometry.faces[ i ];

        for ( var j = 0; j < 3; j ++ ) {

            uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5;
            uvs[ j ].y = face.vertexNormals[ j ].y * 0.5 + 0.5;

        }

    }
        var mesh = new THREE.Mesh(geometry, texture);
        mesh.position.set(position.x, position.y, position.z)
        console.log(mesh)
        this.scene.add(mesh)
}*/
Bubbles.prototype.onDocumentMouseWheel = function(event) {
    //event.preventDefault()
    var fovMAX = 160;
    var fovMIN = 1;
console.log("entra")
    this.camera.fov -= event.wheelDeltaY * 0.05;
    this.camera.fov = Math.max( Math.min( this.camera.fov, fovMAX ), fovMIN );
   // this.camera.projectionMatrix = new THREE.Matrix4().makePerspective(this.camera.fov, window.innerWidth / window.innerHeight, this.camera.near, this.camera.far);
}
Bubbles.prototype.onDocumentMouseMove = function(event) {

    //clientX i clientY son respecte la pantalla, no respecte el Canvas!!!!!
    this.mouseX = -(event.clientX - this.windowHalfX) * 10;
    this.mouseY = -(event.clientY - this.windowHalfY) * 10;

}



Bubbles.prototype.animate = function() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();

}

Bubbles.prototype.render = function() {

    var timer = 0.0001 * Date.now();

    this.camera.position.x += (this.mouseX - this.camera.position.x) * .05;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * .05;

    this.camera.lookAt(this.scene.position);


    /*for ( var i = 0, il = spheres.length; i < il; i ++ ) {
        var sphere = spheres[ i ];
        sphere.position.x = 5000 * Math.cos( timer + i );
        sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );
    }*/

    this.renderer.render(this.scene, this.camera);
}

Bubbles.prototype.onBubbleExplode = function(position){
    var objects = this.spheres;
 
    for(var i=0; i<objects.length;i++){

        if( JSON.stringify(objects[i].position)==JSON.stringify(position)){
            this.explode(objects[i]);
            /*console.log(i)
            console.log('id '+ objects[i].id)
         /*   this.positions.splice(i,1);
            this.scaling.splice(i,1);*/
        }
    }
}

Bubbles.prototype.explode = function(bubble){
    this.positions.splice(bubble.id - 5,1);
    this.scaling.splice(bubble.id - 5,1);
    var mini = bubble.clone();
    var radius = bubble.geometry.parameters.radius;
    mini.scale.x /= 4;
    mini.scale.y /= 4;
    mini.scale.z /= 4;

    while(bubble.scale.x>0.01){
        bubble.scale.x *= 0.5;
        bubble.scale.y *= 0.5;
        bubble.scale.z *= 0.5;
    }

    var miniSpheres = [];
    for(var j=0; j<6 ; j++){
        miniSpheres.push(mini.clone());
    }
    miniSpheres[0].position.x += radius*2;
    miniSpheres[1].position.x -= radius*2;
    miniSpheres[2].position.y += radius*2;
    miniSpheres[3].position.y -= radius*2;
    miniSpheres[4].position.z += radius*2;
    miniSpheres[5].position.z -= radius*2;

    var group = new THREE.Group();

    for(var j=0; j<6 ; j++){
        group.add(miniSpheres[j]);
    }
    var group2 = group.clone();
    //miniGroup.scale= miniGroup.scale/2;
    group2.rotation.x+=0.01
    group2.rotation.y+=0.01
    setTimeout(
        this.addMeshToScene(group),
        this.addMeshToScene(group2)
    , 20)
    
    setTimeout(function(){
        group.visible=false;
        group2.visible=false
        /*scene.remove(group);
        scene.remove(group2);*/
    }, 35)

    // find which bubble to delete from list of spheres
    var bubble_to_delete = -1;
    for(var i = 0; i < this.spheres.length; ++i){
    	if(this.spheres[i].id == bubble.id){
    		bubble_to_delete = i;
            this.scene.remove(bubble)
        }
    }

    this.spheres.splice(bubble_to_delete, 1);

}

Bubbles.prototype.setText = function(text ,position, font){
            
        var geometry = new THREE.TextGeometry( text, {
        font: font,
        size: 80,
        height: 20,
        curveSegments: 2
        })

        geometry.computeBoundingBox();
        var centerOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        var materials = [
            new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
            new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
        ];
        mesh = new THREE.Mesh( geometry, materials );
        mesh.position.x = centerOffset;
        mesh.position.y = 100;
        mesh.position.z = 0;
        this.secene.add(mesh)
   
}

Bubbles.prototype.addMeshToScene = function(mesh){
    this.scene.add(mesh)
}

Bubbles.prototype.addBubble = function (){
    
    var bubbleGeometry = new THREE.SphereGeometry(100, 32, 16);
    var mesh = new THREE.Mesh(bubbleGeometry, this.materials['bubble']);

    mesh.position.x =  Math.random() * 10000 - 5000;
    mesh.position.y =  Math.random() * 10000 - 5000;
    mesh.position.z =  Math.random() * 10000 - 5000;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

    this.scene.add(mesh);
    this.spheres.push(mesh);
    this.syncClient.sendNewBubblePosition(mesh.position, mesh.scale)
}
Bubbles.prototype.onNewBubble = function(content){
    var bubbleGeometry = new THREE.SphereGeometry(100, 32, 16);
    var mesh = new THREE.Mesh(bubbleGeometry, this.materials['bubble']);
    mesh.position.set(content.position.x, content.position.y, content.position.z);

    mesh.scale.set(content.scaling.x, content.scaling.y, content.scaling.z);
    this.scene.add(mesh);
    this.positions.push(mesh.position)
    this.scaling.push(mesh.scaling)
    this.spheres.push(mesh);
   
}
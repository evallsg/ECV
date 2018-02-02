class Bubbles {

    constructor(parent_node) {
        //var miniSpheres= [];

        this.mouseX = 0,
        this.mouseY = 0;

        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.syncClient = new SyncClient(this)
        this.isHost = this.syncClient.checkIfHost(); 

        this.init(parent_node);

    }

}

Bubbles.prototype.onBubblesLoaded = function() {
    var path = "imgs/";
    var format = '.png';

    var urls = [
        path + 'TropicalSunnyDayBack' + format, path + 'TropicalSunnyDayFront' + format,
        path + 'TropicalSunnyDayUp' + format, path + 'TropicalSunnyDayDown' + format,
        path + 'TropicalSunnyDayLeft' + format, path + 'TropicalSunnyDayRight' + format
    ];
    var textureCube = new THREE.CubeTextureLoader().load(urls);
    textureCube.format = THREE.RGBFormat;

    this.scene = new THREE.Scene();
    this.scene.background = textureCube;

    var geometry = new THREE.SphereGeometry(100, 32, 16);
    //var geometry2 = new THREE.SphereGeometry(50,32,16);
    var shader = THREE.FresnelShader;
    //var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    //uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial({
        uniforms: {

            "mRefractionRatio": { value: 1.02 },
            "mFresnelBias": { value: 0.1 },
            "mFresnelPower": { value: 2.0 },
            "mFresnelScale": { value: 1.0 },
            "tCube": { value: textureCube }

        },
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    });


    this.spheres = []
    for (var i = 0; i < 20; i++) {

        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = this.positions[i][0];
        mesh.position.y = this.positions[i][1];
        mesh.position.z = this.positions[i][2];

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

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

    this.animate();
}


Bubbles.prototype.init = function(parent_node) {

    this.container = document.createElement('div');
    document.querySelector(parent_node).appendChild(this.container);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
    this.camera.position.z = 3200;

    //if we are the host, we compute the positions of the bubbles
    this.positions = []
    if(this.isHost)
    {	
    	for (var i = 0; i < 20; i++)
    		this.positions.push([Math.random() * 10000 - 5000, Math.random() * 10000 - 5000, Math.random() * 10000 - 5000])

    	this.onBubblesLoaded();
    }
    else
    {
    	var a = 0;
    	//TODO
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

    for (var i = 0; i < intersects.length; i++) {
        
        var group = new THREE.Group();
        var basicMaterial = new THREE.MeshBasicMaterial( { color: 0xfff000, opacity: 0, wireframe: true } );

        var object = intersects[i].object;

        var mini = object.clone();
        var radius = object.geometry.parameters.radius;
        mini.scale.x = mini.scale.x/4;
        mini.scale.y = mini.scale.y/4;
        mini.scale.z = mini.scale.z/4;
        while(object.scale.x>0){
            object.scale.x = object.scale.x / 2;
            object.scale.y = object.scale.y / 2;
            object.scale.z = object.scale.z / 2;
        }

        var miniSpheres = [];
        for(var j=0; j<6 ; j++){
            miniSpheres.push(mini.clone());
        }
        miniSpheres[0].position.x = miniSpheres[0].position.x +radius*2;
        miniSpheres[1].position.x = miniSpheres[1].position.x -radius*2;
        miniSpheres[2].position.y = miniSpheres[2].position.y +radius*2;
        miniSpheres[3].position.y = miniSpheres[3].position.y -radius*2;
        miniSpheres[4].position.z = miniSpheres[4].position.z +radius*2;
        miniSpheres[5].position.z = miniSpheres[5].position.z -radius*2;
        
        for(var j=0; j<6 ; j++){
            group.add(miniSpheres[j]);
        }
        var group2 = group.clone();
        //miniGroup.scale= miniGroup.scale/2;
        group2.rotation.x+=0.01
        group2.rotation.y+=0.01
        this.scene.add(group)
        this.scene.add(group2)
        setTimeout(function(){
            group.visible=false;
            group2.visible=false
        }, 25)

        

    }

}
Bubbles.prototype.onDocumentMouseWheel = function(event) {
    event.preventDefault()
    var fovMAX = 160;
    var fovMIN = 1;
console.log(entra)
    this.camera.fov -= event.wheelDeltaY * 0.05;
    this.camera.fov = Math.max( Math.min( this.camera.fov, fovMAX ), fovMIN );
    this.camera.projectionMatrix = new THREE.Matrix4().makePerspective(this.camera.fov, window.innerWidth / window.innerHeight, this.camera.near, this.camera.far);
}
Bubbles.prototype.onDocumentMouseMove = function(event) {

    //clientX i clientY son respecte la pantalla, no respecte el Canvas!!!!!
    this.mouseX = -(event.clientX - this.windowHalfX) * 10;
    this.mouseY = -(event.clientY - this.windowHalfY) * 10;

}

//

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
class Bubbles {

    constructor(parent_node) {
        //var miniSpheres= [];

        this.mouseX = 0,
        this.mouseY = 0;

        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.init(parent_node);
        this.animate();

    }

}

Bubbles.prototype.init = function(parent_node) {

    this.container = document.createElement('div');
    document.querySelector(parent_node).appendChild(this.container);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
    this.camera.position.z = 3200;


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

        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        this.scene.add(mesh);
        this.spheres.push(mesh);

    }
    //bombolles per col·lisio
    /*var mesh2 = new THREE.Mesh( geometry2, material );
    miniSpheres.push(mesh2)
    miniSpheres.push(mesh2)*/
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
        //miniSpheres[0].position = intersects[i].object.position;

        //miniSpheres[0].geometry.parameters.radius = intersects[i].object.geometry.parameters.radius/3;
        //miniSpheres[1].position = intersects[i].object.position;

        //miniSpheres[1].geometry.parameters.radius = intersects[i].object.geometry.parameters.radius/3;
        //intersects[ i ].object.visible=false;
        var object = intersects[i].object;
        object.scale.x = object.scale.x / 2;
        object.scale.y = object.scale.y / 2;
        object.scale.z = object.scale.z / 2;

    }
    /*for ( var j = 0; j < miniSpheres.length; j++ ) {
    	scene.add(miniSpheres[j])
    }*/

    console.log(this.scene)

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
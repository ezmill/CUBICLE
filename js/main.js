if (!Detector.webgl) Detector.addGetWebGLMessage();

var SCALE = 1;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var NEAR = 0.01,
    FAR = 10000.0;
var VIEW_ANGLE = 40;

 // controls

var mouseX = 0;
var mouseY = 0;

var targetX = 0,
    targetY = 0;
var angle = 0;
var target = new THREE.Vector3(0, 0, 0);

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

 // core

var renderer, camera, scene, clock;

 // lights

var areaLight1, areaLight2, areaLight3;

 //

init();
animate();

 // -----------------------------

function init() {

    // renderer

    renderer = new THREE.WebGLDeferredRenderer({
        width: WIDTH,
        height: HEIGHT,
        scale: SCALE,
        antialias: true,
        tonemapping: THREE.FilmicOperator,
        brightness: 2
    });

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // effects
    console.log(THREE.Material.side);
    var bloomEffect = new THREE.BloomPass(0.3);
    renderer.addEffect(bloomEffect);

    // camera

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, WIDTH / HEIGHT, NEAR, FAR);
    camera.position.y = 80;
    camera.position.z = 210;
    // camera.rotation.x = Math.PI/2;

    controls = new THREE.OrbitControls(camera);
    // scene

    scene = new THREE.Scene();
    scene.add(camera);

    clock = new THREE.Clock();

    // add lights
    room = new THREE.Object3D();

    initLights();

    // add objects

    initObjects();

    // events
    // initFrameDifferencing();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

}

 // -----------------------------

function createAreaEmitter(light) {
    var lightTex = THREE.ImageUtils.loadTexture("textures/light.jpg");
    lightTex.flipX = true;
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: light.color.getHex(),
        vertexColors: THREE.FaceColors,
        map: lightTex
    });

    // var backColor = 0x222222;

    // geometry.faces[ 5 ].color.setHex( backColor );
    // geometry.faces[ 4 ].color.setHex( backColor );
    // geometry.faces[ 2 ].color.setHex( backColor );
    // geometry.faces[ 1 ].color.setHex( backColor );
    // geometry.faces[ 0 ].color.setHex( backColor );

    var emitter = new THREE.Mesh(geometry, material);
    emitter.scale.set(light.width * 2, 0.5, light.height * 2);

    return emitter;

}

function setupAreaLight(light) {

    var matrix = light.matrixWorld;

    light.right.set(1, 0, 0);
    light.normal.set(0, -1, 0);

    light.right.applyMatrix4(matrix);
    light.normal.applyMatrix4(matrix);

}

function initLights() {

    areaLight1 = new THREE.AreaLight(0xffffff, 10);
    areaLight1.position.set(48, 120, 0);
    areaLight1.rotation.set(0, 0, 0);
    areaLight1.width = 23.5 / 2;
    areaLight1.height = 47.5 / 2;
    // areaLight1.scale.multiplyScalar(0.5);
    scene.add(areaLight1);
    room.add(areaLight1);

    var meshEmitter = createAreaEmitter(areaLight1);
    areaLight1.add(meshEmitter);

    //

    areaLight2 = new THREE.AreaLight(0xffffff, 10);
    areaLight2.position.set(0, 120, 0);
    areaLight2.rotation.set(0, 0, 0);
    areaLight2.width = 23.5 / 2;
    areaLight2.height = 47.5 / 2;
    // areaLight2.scale.multiplyScalar(0.5);

    scene.add(areaLight2);
    room.add(areaLight2);

    var meshEmitter = createAreaEmitter(areaLight2);
    areaLight2.add(meshEmitter);

    //

    areaLight3 = new THREE.AreaLight(0xffffff, 10);
    areaLight3.position.set(-48, 120, 0);
    areaLight3.rotation.set(0, 0, 0);
    areaLight3.width = 23.5 / 2;
    areaLight3.height = 47.5 / 2;
    // areaLight3.scale.multiplyScalar(0.5);
    scene.add(areaLight3);
    room.add(areaLight3);

    var meshEmitter = createAreaEmitter(areaLight3);
    areaLight3.add(meshEmitter);

    pointLight1 = new THREE.PointLight(0xffffff, 0.1);
    pointLight1.position = areaLight1.position;
    pointLight1.rotation = areaLight1.position;
    scene.add(pointLight1);
    room.add(pointLight1);
    pointLight2 = new THREE.PointLight(0xffffff, 0.1);
    pointLight2.position = areaLight2.position;
    pointLight2.rotation = areaLight2.position;
    scene.add(pointLight2);
    room.add(pointLight2);
    pointLight3 = new THREE.PointLight(0xffffff, 0.1);
    pointLight3.position = areaLight3.position;
    pointLight3.rotation = areaLight3.position;
    scene.add(pointLight3);
    room.add(pointLight3);



}

 // -----------------------------

function initObjects() {
    noiseTex = THREE.ImageUtils.loadTexture("textures/noise.png");
    noiseTex.wrapS = THREE.RepeatWrapping;
    noiseTex.wrapT = THREE.RepeatWrapping;
    noiseTex.repeat.set(2, 2);


    var loader = new THREE.BinaryLoader();
    loader.load("obj/gallery/ceiling-test.js", function(geometry, materials) {

        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            ambient: 0xffffff,
            emissive: 0x666666,
            bumpMap: noiseTex
        });
        var object = new THREE.Mesh(geometry, material);
        // object.scale.multiplyScalar( 10 );
        // object.position.y = 10;
        scene.add(object);
        room.add(object);

    });

    // var loader = new THREE.OBJLoader(manager);
    // loader.load( "obj/gallery/cloth.obj", function ( object ) {

    // 	object.traverse( function ( child ) {
    // 		if ( child instanceof THREE.Mesh ) {
    // 			child.material = new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xffffff, emissive: 0x666666 } );

    // 		}
    // 	});

    // 	// var material = 					// var object = new THREE.Mesh( geometry, material );
    // 	// object.scale.multiplyScalar( 10 );
    // 	object.position.z = -30;
    // 	object.rotation.y = Math.PI;
    // 	scene.add( object );

    // } );
    var roomWidth = 200;
    var roomHeight = 120;
    var roomDepth = 200;
    var wallThickness = 2;

    var concreteTex = THREE.ImageUtils.loadTexture("textures/concrete.jpg");
    concreteTex.wrapS = THREE.RepeatWrapping;
    concreteTex.wrapT = THREE.RepeatWrapping;
    concreteTex.repeat.set(2, 2);
    floorGeometry = new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth);
    floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xaaaaaa,
        shininess: 10,
        side: 2,
        map: concreteTex,
        lightMap: concreteTex,
        bumpMap: concreteTex,
        bumpScale: 0.38,
        combine: THREE.MixOperation,
        reflectivity: 0.5
    });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.rotation.x = -0.5 * Math.PI;
    floor.position.set(0, 0, 0);
    scene.add(floor);
    room.add(floor);

    leftWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth);
    leftWallMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        bumpMap: noiseTex
    })
    leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    scene.add(leftWall);
    room.add(leftWall);

    backWallGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness);
    backWallMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        bumpMap: noiseTex
    })
    backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    scene.add(backWall);
    room.add(backWall);


    rightWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth);
    rightWallMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        bumpMap: noiseTex
    });
    rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    scene.add(rightWall);
    room.add(rightWall);

    var urls = [];
    for (var i = 0; i < 6; i++) {
        var url = "textures/stripe2048.jpg";
        urls.push(url);
    }
    texCube = THREE.ImageUtils.loadTextureCube(urls);
    // texCube.mapping = THREE.CubeReflectionMapping;
    // texCube = THREE.ImageUtils.loadTexture("textures/stripe6.jpg");
    dazzleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, envMap: texCube, combine: THREE.MixOperation, useRefract: 1, refractionRatio: 0.1});
    dazzleGeometry = new THREE.SphereGeometry(10,100,100);
    dazzleObject = new THREE.Mesh(dazzleGeometry, dazzleMaterial);
    dazzleObject.position.y = 5;
    scene.add(dazzleObject);
    room.add(dazzleObject);


    room.position.y = 20;
    scene.add(room);





}
var inputTexture, cameraRTT, globalUniforms, video, planeGeometry, art;

function initFrameDifferencing() {
    cameraRTT = new THREE.OrthographicCamera(WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, -10000, 10000);
    cameraRTT.position.z = 100;
    outputRenderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
    });
    outputRenderer.setSize(WIDTH, HEIGHT);
    outputRenderer.setClearColor(0xffffff, 1);

    // globalUniforms = {
    // 	time: { type: "f", value: 0.0 } ,
    // 	resolution: {type: "v2", value: new THREE.Vector2(WIDTH,HEIGHT)},
    // 	step_w: {type: "f", value: 1/WIDTH},
    // 	step_h: {type: "f", value: 1/HEIGHT},
    // 	mouseX: {type: "f", value: 1.0},
    // 	mouseY: {type: "f", value: 1.0},
    // 	tv_resolution: {type: "f", value: 640.0},
    // 	tv_resolution_y: {type: "f", value: 1600.0}
    // }
    video = document.createElement("video");
    video.src = "textures/satin.mp4";
    video.loop = true;
    video.play();
    inputTexture = THREE.ImageUtils.loadTexture("textures/brick_diffuse.jpg");
    // inputTexture = new THREE.Texture(video);
    inputTexture.minFilter = THREE.LinearFilter;
    // inputTexture = noiseTex;
    inputTexture.needsUpdate = true;

    //    planeGeometry = new THREE.PlaneBufferGeometry(WIDTH, HEIGHT);

    //    feedbackObject1 = new feedbackObject({ time: globalUniforms.time, resolution: globalUniforms.resolution, texture: { type: 't', value: inputTexture }, mouseX: globalUniforms.mouseX, mouseY: globalUniforms.mouseY
    // }, "vs", 
    // "diffFs");
    // feedbackObject2 = new feedbackObject({ time: globalUniforms.time, resolution: globalUniforms.resolution, texture: { type: 't', value: feedbackObject1.renderTarget }, texture2: { type: 't', value: inputTexture }, mouseX: globalUniforms.mouseX, mouseY: globalUniforms.mouseY
    // }, "vs", 
    // "fs");
    // frameDifferencer = new feedbackObject({ time: globalUniforms.time, resolution: globalUniforms.resolution, texture: { type: 't', value: feedbackObject1.renderTarget }, texture2: { type: 't', value: feedbackObject2.renderTarget }, texture3: { type: 't', value: inputTexture }, mouseX: globalUniforms.mouseX, mouseY: globalUniforms.mouseY
    // }, "vs", 
    // "diffFs");
    // feedbackObject3 = new feedbackObject({ time: globalUniforms.time, resolution: globalUniforms.resolution, texture: { type: 't', value: frameDifferencer.renderTarget }, mouseX: globalUniforms.mouseX, mouseY: globalUniforms.mouseY
    // }, "vs", 
    // "fs"); 
    // feedbackObject4 = new feedbackObject({ time: globalUniforms.time, resolution: globalUniforms.resolution, texture: { type: 't', value: feedbackObject3.renderTarget }, mouseX: globalUniforms.mouseX, mouseY: globalUniforms.mouseY
    // }, "vs", 
    // "fs");
    artMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        ambient: 0xffffff,
        specular: 0xffffff,
        shininess: 300,
        combine: THREE.AddOperation,
        side: THREE.DoubleSide,
        map: inputTexture
    });

    artGeometry = new THREE.BoxGeometry(100, 100, 2);
    art = new THREE.Mesh(artGeometry, artMaterial);
    art.position.set(0, 80, -98);
    // scene.add(art);

    rtt = new THREE.WebGLRenderTarget(WIDTH, HEIGHT, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    });

    // artTex = new THREE.ImageUtils.loadTexture("textures/art2.png");
    // artTex.flipY = true;
    // var loader = new THREE.BinaryLoader();
    // loader.load("obj/gallery/cloth.js", function(geometry, materials) {

    //     var material = new THREE.MeshLambertMaterial({
    //         color: 0xffffff,
    //         ambient: 0xffffff,
    //         specular: 0xffffff,
    //         shininess: 300,
    //         combine: THREE.AddOperation,
    //         side: THREE.DoubleSide,
    //         map: artTex
    //     })
    //     var object = new THREE.Mesh(geometry, material);
    //     // object.scale.multiplyScalar( 10 );
    //     object.position.z = -30;
    //     object.rotation.y = Math.PI;
    //     scene.add(object);
    //     room.add(object);

    // });
}

function feedbackObject(uniforms, vertexShader, fragmentShader) {
    this.scene = new THREE.Scene();
    this.renderTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    });
    this.material = new THREE.ShaderMaterial({
        uniforms: uniforms, //uniforms object from constructor
        vertexShader: document.getElementById(vertexShader).textContent,
        fragmentShader: document.getElementById(fragmentShader).textContent
    });
    this.mesh = new THREE.Mesh(planeGeometry, this.material);
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);
}

function onDocumentMouseMove(event) {

}

function animate() {

    requestAnimationFrame(animate);

    render();

}

function feedbackDraw() {


}

function render() {
    var time = Date.now();
    // camera.lookAt(backWall.position);

    // inputTexture.needsUpdate = true;
    // outputRenderer.render(feedbackObject2.scene, cameraRTT, feedbackObject2.renderTarget, true);
    // outputRenderer.render(frameDifferencer.scene, cameraRTT, frameDifferencer.renderTarget, true);
    // outputRenderer.render(feedbackObject3.scene, cameraRTT, feedbackObject3.renderTarget, true);
    // outputRenderer.render(feedbackObject4.scene, cameraRTT, feedbackObject4.renderTarget, true);
    // render
    renderer.render(scene, camera);

    // outputRenderer.render(scene, cameraRTT, rtt, true);
    // art.material.map = rtt;
    // outputRenderer.render( scene, camera );
    // outputRenderer.render(feedbackObject1.scene, cameraRTT, feedbackObject1.renderTarget, true);

    // var a = feedbackObject3.renderTarget;
    // feedbackObject3.renderTarget = feedbackObject1.renderTarget;
    // feedbackObject1.renderTarget = a;
}

function onWindowResize(event) {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight - 2 * MARGIN;

    renderer.setSize(WIDTH, HEIGHT);

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

}
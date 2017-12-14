var camera, controls, scene, renderer;
var mesh;
var raycaster, mouse;
var INTERSECTED;

init();
animate();
function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 200;


    scene = new THREE.Scene();
    var texture = new THREE.TextureLoader().load( 'img/maps/moon.jpg');
    var normal = new THREE.TextureLoader().load( 'img/maps/normal.jpg' );
    var overlay = new THREE.TextureLoader().load( 'img/overlay/help.png' );
    var geometry = new THREE.SphereGeometry( 100, 50, 50 );
    
    var material = new THREE.MeshStandardMaterial( { map: texture , normalMap: normal, normalScale: new THREE.Vector2(0.1,0.1), roughness: 0.9, vertexColors: THREE.FaceColors} );
    

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //Raycaster and mouse stuff
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.addEventListener( 'change', render ); // remove when using animation loop
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = 0.1;
    controls.maxDistance = 400;
    controls.minDistance = 130;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.05;

    // Light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 2);
    directionalLight.position.set(10,0,0 )
    
    scene.add( directionalLight );

    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 ); // soft white light
    scene.add( ambientLight );

    document.getElementById("moon").appendChild( renderer.domElement );
    //
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() {
    requestAnimationFrame( animate );
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    // stats.update(); 

    render();
}

function render() {

    // raycaster.setFromCamera( mesh.position, camera ); // To intersect the middle face
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObject( mesh );

    if ( intersects.length > 0 ) {
        var faceIndex = intersects[0].faceIndex - intersects[0].faceIndex % 2;

        if (INTERSECTED != faceIndex){
            
            mesh.geometry.faces[faceIndex].color.setHex(0xff0000);
            mesh.geometry.faces[faceIndex+1].color.setHex(0xff0000);
            if(INTERSECTED != null){
                mesh.geometry.faces[INTERSECTED].color.set(new THREE.Color());
                mesh.geometry.faces[INTERSECTED+1].color.set(new THREE.Color());
            }
            INTERSECTED = faceIndex;
            mesh.geometry.colorsNeedUpdate = true;
        }

        // var intersect = intersects[ 0 ];
        // var face = intersect.face;
        // console.log(face)
        
        // face.color = new THREE.Color( 0xff0000 );
        // face.color.setHex(0xff0000 );
        // face.color.set(new THREE.Color())
        
        // console.log(intersect)
    } 


    renderer.render( scene, camera );
}
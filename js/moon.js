var camera, controls, scene, renderer;
var mesh;
var faceIndex;
var raycaster, mouse;
var INTERSECTED;

init();
animate();
function init() {
    camera = new THREE.PerspectiveCamera( 68, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 200;

    scene = new THREE.Scene();
    var texture = new THREE.TextureLoader().load( 'img/maps/moon2.jpg');
    var normal = new THREE.TextureLoader().load( 'img/maps/normal2.jpg' );
    var geometry = new THREE.SphereGeometry( 100, 50, 50 );
    
    var material = new THREE.MeshStandardMaterial({ 
        map: texture , 
        normalMap: normal, 
        normalScale: new THREE.Vector2(0.1,0.1), 
        roughness: 0.9, 
        vertexColors: THREE.FaceColors
    });

    mesh = new THREE.Mesh( geometry, material );
    // mesh.callback = function(param) { console.log(param); }
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //Raycaster and mouse stuff
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Orbit Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableZoom = true;
    controls.maxDistance = 400;
    controls.minDistance = 130;
    controls.enableRotate = false;


    // Light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 2);
    directionalLight.position.set(-10,10,10 );
    
    scene.add( directionalLight );

    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 ); // soft white light
    scene.add( ambientLight );

    document.getElementById("moon").appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );


    // Mouse Dragging Logic
    var isDragging = false;
    var previousMousePosition = {
        x: 0,
        y: 0
    };

    const toRadians = (angle) => {
        return angle * (Math.PI / 180);
    };

    const toDegrees = (angle) => {
        return angle * (180 / Math.PI);
    };

    const renderArea = renderer.domElement;

    renderArea.addEventListener('mousedown', (e) => {
        isDragging = true;
    });

    renderArea.addEventListener('mousemove', (e) => {
        var deltaMove = {
            x: e.offsetX-previousMousePosition.x,
            y: e.offsetY-previousMousePosition.y
        };

        if(isDragging) {

            let deltaRotationQuaternion = new THREE.Quaternion().
            setFromEuler(
                new THREE.Euler(toRadians(deltaMove.y * 0.2), toRadians(deltaMove.x * 0.2), 0, 'XYZ')
            );

            mesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, mesh.quaternion);
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    document.addEventListener('mouseup', (e) => {
        isDragging = false;
    });
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

function onDocumentMouseDown( event ) {
    event.preventDefault();

    console.log(faceIndex)
    document.getElementById("rbox-acre--details").textContent="ACRE #" + faceIndex;

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObject( mesh ); 


    if ( intersects.length > 0 ) {
        faceIndex = intersects[0].faceIndex - intersects[0].faceIndex % 2;

        if (mesh.geometry.faces[faceIndex].color.getHexString() == 'ffffff') {
            mesh.geometry.faces[faceIndex].color.setHex(0x4c00ec);
            mesh.geometry.faces[faceIndex+1].color.setHex(0x4c00ec); 
            if (INTERSECTED != faceIndex) {   
                mesh.geometry.faces[faceIndex].color.setHex(0x4c00ec);
                mesh.geometry.faces[faceIndex+1].color.setHex(0x4c00ec); 
            }
        } else {
            mesh.geometry.faces[faceIndex].color.setHex(0xffffff);
            mesh.geometry.faces[faceIndex+1].color.setHex(0xffffff);
            if (INTERSECTED != faceIndex) {   
                mesh.geometry.faces[faceIndex].color.setHex(0xffffff);
                mesh.geometry.faces[faceIndex+1].color.setHex(0xffffff); 
            } 
        }

        INTERSECTED = faceIndex;
        mesh.geometry.colorsNeedUpdate = true;
    }
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
        faceIndex = intersects[0].faceIndex - intersects[0].faceIndex % 2;

        // if (INTERSECTED != faceIndex){
            
            // mesh.geometry.faces[faceIndex].color.setHex(0xff0000);
            // mesh.geometry.faces[faceIndex+1].color.setHex(0xff0000);
            // if(INTERSECTED != null){
            //     mesh.geometry.faces[INTERSECTED].color.set(new THREE.Color());
            //     mesh.geometry.faces[INTERSECTED+1].color.set(new THREE.Color());
            // }
            
        //     mesh.geometry.colorsNeedUpdate = true;
        // }

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
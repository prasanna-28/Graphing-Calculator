var container;
var camera, scene, renderer;
var mesh;
var mouseX = 0, mouseY = 0;
var mouseDown = false;
var mouseButton = 0; // store which mouse button is pressed
var radius = 300; // distance from the center to the camera
var theta = 0; // angle for the rotation around the graph
var phi = 0; // angle for the up and down rotation

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = radius;

    scene = new THREE.Scene();

    var func = getFunc(document.getElementById('function-input').value);

    var geometry = new THREE.ParametricGeometry(func, 50, 50);

    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    var axesHelper = new THREE.AxesHelper( 150 );
    scene.add( axesHelper );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    window.addEventListener( 'resize', onWindowResize, false );
    var functionForm = document.getElementById('function-form');
    functionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var func = getFunc(document.getElementById('function-input').value);
        var newGeometry = new THREE.ParametricGeometry(func, 50, 50);
        mesh.geometry.dispose();
        mesh.geometry = newGeometry;
    });
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown(event) {
    mouseDown = true;
    mouseButton = event.button;
}

function onDocumentMouseUp(event) {
    mouseDown = false;
}

function onDocumentMouseMove(event) {

    if (!mouseDown || mouseButton !== 0) return;
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = - (event.clientY / window.innerHeight) * 2 + 1;

    theta -= mouseX ;
    phi -= mouseY ;
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( phi ) );
    camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    camera.lookAt( scene.position );
}

function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );

}

// Function to generate a function from user input
function getFunc(input) {
    var funcString = "var func = function(u, v, vector) {var x = u * 200 - 100; var y = v * 200 - 100; var z = " + input + "; vector.set(x, y, z);}; func";
    return eval(funcString);
}

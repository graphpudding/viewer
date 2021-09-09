import './styles/index.scss';
import './assets/fonts/Roboto-Regular.ttf';
import './component.js';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

var canvas = document.getElementById("babylon");
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};
function $_GET(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
}
var createScene = async function() {
  const scene = await BABYLON.SceneLoader.LoadAsync(
    "scene/",
    $_GET("model"),
    engine
);
//let camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3( 0.32161276833553787, -0.16917787249847976, -1.9667089450908692), scene);
//camera.angularSensibilityY = 3000;
//camera.angularSensibilityX = 3000;
//camera.lowerRadiusLimit = .1;
//camera.wheelPrecision = 30;
//camera.setTarget(BABYLON.Vector3.Zero());
//camera.attachControl(canvas, true);

function addCamera() {
      scene.createDefaultCamera(true, true, true);

     var helperCamera = scene.cameras.pop();
     scene.cameras.push(helperCamera);
     let rads = []
       scene.meshes.forEach((item, i) => {
         rads.push(item.getBoundingInfo().boundingSphere.maximum.x)
     });


     helperCamera.radius = Math.max.apply(null, rads)*5;
     //helperCamera.alpha = Math.PI / 4;
     //helperCamera.beta = Math.PI / 4;
}

addCamera()

let lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("scene/environmentSpecular.env", scene);
lighting.name = "runyonCanyon";
lighting.gammaSpace = false;
scene.environmentTexture = lighting;
scene.createDefaultSkybox(scene.environmentTexture, true, (scene.activeCamera.maxZ - scene.activeCamera.minZ) / 2, 0.3, false);
  return scene;
};

var asyncEngineCreation = async function() {
  console.log(createDefaultEngine())
  try {
    return createDefaultEngine();
  } catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    return createDefaultEngine();
  }
}
window.initFunction = async function() {

  engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  scene = await createScene();
  window.scene = scene;
};
window.initFunction().then(() => {
  sceneToRender = scene
  engine.runRenderLoop(function() {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function() {
  engine.resize();
});

"use strict";

let body;

let hierarchyAddElementEvent;
let hierarchyAddElementContainer;

let hideableComponents;

let onChangeTransform;
let onChangeCamera;

let addElementButton;
let removeElementButton;

let dropdownContent;

let createCubeContent;
let createConeContent;
let createSphereContent;

let transformComponent;
let cameraComponent;

let activeElement = null;
let listDOM = [];

let id = 0;

function createElement(shape, nameShape) {
    const newElement = document.createElement('a');
    const newElementText = document.createTextNode(
        nameShape + "_" + id.toString()
    );

    newElement.setAttribute("href", "#");
    newElement.appendChild(newElementText);

    newElement.onclick = setAsActive;

    hierarchyAddElementContainer.appendChild(newElement);
    listDOM.push(newElement);
    id++;

    canvasController.createObject(shape);

    updateHierarchy();
}

function createCube() {
    const shapes = canvasController.shapes;
    createElement(shapes.cube, "cube");
}

function createCone() {
    const shapes = canvasController.shapes;
    createElement(shapes.cone, "cone");
}

function createSphere() {
    const shapes = canvasController.shapes;
    createElement(shapes.sphere, "sphere");
}

function removeElement() {
    if (activeElement === null) {
        return;
    }

    const index = listDOM.indexOf(activeElement);
    if (index > -1) {
        listDOM.splice(index, 1);
        canvasController.removeObject(index);
    }

    activeElement.remove();
    activeElement = null;

    updateHierarchy();
}

function setAsActive() {
    listDOM.forEach(element => element.classList.remove("active"));
    this.classList.add("active");
    activeElement = this;

    updateTransformComponent();

    updateHierarchy();
}

function updateHierarchy() {
    removeElementButton.disabled = activeElement === null;
    hideableComponents.hidden = activeElement === null;
}

function changeCamera() {
    const camera = canvasController.camera;

    camera.position.x = Number.parseFloat(cameraComponent.position.x.value);
    camera.position.y = Number.parseFloat(cameraComponent.position.y.value);
    camera.position.z = Number.parseFloat(cameraComponent.position.z.value);

    camera.rotation.x = Number.parseFloat(cameraComponent.rotation.x.value);
    camera.rotation.y = Number.parseFloat(cameraComponent.rotation.y.value);
    camera.rotation.z = Number.parseFloat(cameraComponent.rotation.z.value);

    camera.fieldOfView = Number.parseFloat(cameraComponent.fov.value);
    camera.zNear = Number.parseFloat(cameraComponent.zNear.value);
    camera.zFar = Number.parseFloat(cameraComponent.zFar.value);

    updateCameraComponent();
}

function cameraConstructor() {
    const component = ".camera .row ";

    return {
        position: positionConstructor(component),
        rotation: rotationConstructor(component),

        fov: document.querySelector(".fov"),
        zNear: document.querySelector(".z-near"),
        zFar: document.querySelector(".z-far")
    }
}

function updateCameraComponent() {

    const camera = canvasController.camera;

    cameraComponent.position.x.value = camera.position.x;
    cameraComponent.position.y.value = camera.position.y;
    cameraComponent.position.z.value = camera.position.z;

    cameraComponent.rotation.x.value = camera.rotation.x;
    cameraComponent.rotation.y.value = camera.rotation.y;
    cameraComponent.rotation.z.value = camera.rotation.z;

    cameraComponent.fov.value = camera.fieldOfView
    cameraComponent.zNear.value = camera.zNear;
    cameraComponent.zFar.value = camera.zFar;
}

function changeTransform() {
    if (activeElement === null) {
        return;
    }

    const index = listDOM.indexOf(activeElement);
    if (index > -1) {
        const object = canvasController.objects[index];

        object.position.x = transformComponent.position.x.value;
        object.position.y = transformComponent.position.y.value;
        object.position.z = transformComponent.position.z.value;

        object.rotation.x = transformComponent.rotation.x.value;
        object.rotation.y = transformComponent.rotation.y.value;
        object.rotation.z = transformComponent.rotation.z.value;

        object.scale.x    = transformComponent.scale.x.value;
        object.scale.y    = transformComponent.scale.y.value;
        object.scale.z    = transformComponent.scale.z.value;
    }
}

function transformConstructor() {
    const component = ".transform .row ";

    return {
        position: positionConstructor(component),
        rotation: rotationConstructor(component),
        scale   : scaleConstructor(component)
    }
}

function positionConstructor(component) {
    return {
        x: document.querySelector(component + ".position .vector3-x "),
        y: document.querySelector(component + ".position .vector3-y "),
        z: document.querySelector(component + ".position .vector3-z ")
    }
}

function rotationConstructor(component) {
    return {
        x: document.querySelector(component + ".rotation .vector3-x "),
        y: document.querySelector(component + ".rotation .vector3-y "),
        z: document.querySelector(component + ".rotation .vector3-z ")
    }
}

function scaleConstructor(component) {
    return {
        x: document.querySelector(component + ".scale .vector3-x "),
        y: document.querySelector(component + ".scale .vector3-y "),
        z: document.querySelector(component + ".scale .vector3-z ")
    }
}

function updateTransformComponent() {
    if (activeElement === null) {
        return;
    }

    const index = listDOM.indexOf(activeElement);
    if (index > -1) {
        const object = canvasController.objects[index];

        transformComponent.position.x.value = object.position.x;
        transformComponent.position.y.value = object.position.y;
        transformComponent.position.z.value = object.position.z;

        transformComponent.rotation.x.value = object.rotation.x;
        transformComponent.rotation.y.value = object.rotation.y;
        transformComponent.rotation.z.value = object.rotation.z;

        transformComponent.scale.x.value    = object.scale.x;
        transformComponent.scale.y.value    = object.scale.y;
        transformComponent.scale.z.value    = object.scale.z;
    }

}

function toggleDropdownContent() {
    dropdownContent.classList.toggle('show');
}

function disableDropdownContent(event) {
    if (!event.target.matches('.hierarchy-button-plus')) {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }
}

function uiControllerConstructor() {
    hierarchyAddElementEvent = document.querySelector(".hierarchy-add-element");
    hierarchyAddElementContainer = document.querySelector(".hierarchy-link");

    addElementButton = document.querySelector(".hierarchy-button-plus");
    removeElementButton = document.querySelector(".hierarchy-button-minus");

    createCubeContent = document.querySelector(".create-cube");
    createConeContent = document.querySelector(".create-cone");
    createSphereContent = document.querySelector(".create-sphere");

    hideableComponents = document.querySelector(".hideable-components");

    onChangeTransform = document.querySelector(".on-change-transform");
    onChangeCamera = document.querySelector(".on-change-camera");

    dropdownContent = document.querySelector(".dropdown-content");

    body = document.querySelector("body");

    addElementButton.onclick = toggleDropdownContent;
    removeElementButton.onclick = removeElement;

    onChangeTransform.onchange = changeTransform;
    onChangeCamera.onchange = changeCamera;

    transformComponent = transformConstructor();
    cameraComponent = cameraConstructor();

    body.onclick = disableDropdownContent;

    createCubeContent.onclick = createCube;
    createConeContent.onclick = createCone;
    createSphereContent.onclick = createSphere;

    canvasController.construct();

    updateCameraComponent();
    updateHierarchy();
}

uiControllerConstructor();


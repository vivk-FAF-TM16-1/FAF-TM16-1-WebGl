"use strict";

let body;

let hierarchyAddElementEvent;
let hierarchyAddElementContainer;

let hideableComponents;

let onChangeComponent;

let addElementButton;
let removeElementButton;

let dropdownContent;

let createCubeContent;
let createConeContent;
let createSphereContent;

let transformComponent;

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

function changeComponent() {
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
    return {
        position: positionConstructor(),
        rotation: rotationConstructor(),
        scale   : scaleConstructor()
    }
}

function positionConstructor() {
    return {
        x: document.querySelector(".position .vector3-x"),
        y: document.querySelector(".position .vector3-y"),
        z: document.querySelector(".position .vector3-z")
    }
}

function rotationConstructor() {
    return {
        x: document.querySelector(".rotation .vector3-x"),
        y: document.querySelector(".rotation .vector3-y"),
        z: document.querySelector(".rotation .vector3-z")
    }
}

function scaleConstructor() {
    return {
        x: document.querySelector(".scale .vector3-x"),
        y: document.querySelector(".scale .vector3-y"),
        z: document.querySelector(".scale .vector3-z")
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

    onChangeComponent = document.querySelector(".on-change");

    dropdownContent = document.querySelector(".dropdown-content");

    body = document.querySelector("body");

    addElementButton.onclick = toggleDropdownContent;
    removeElementButton.onclick = removeElement;

    onChangeComponent.onchange = changeComponent;

    transformComponent = transformConstructor();

    body.onclick = disableDropdownContent;

    createCubeContent.onclick = createCube;
    createConeContent.onclick = createCone;
    createSphereContent.onclick = createSphere;

    canvasController.construct();

    updateHierarchy();
}

uiControllerConstructor();


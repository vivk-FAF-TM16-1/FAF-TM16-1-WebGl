"use strict";

let hierarchyAddElementEvent;
let hierarchyAddElementContainer;

let hideableComponents;

let onChangeComponent;

let addElementButton;
let removeElementButton;

let transformComponent;

let activeElement = null;
let listDOM = [];

let id = 0;

function setup() {
    hierarchyAddElementEvent = document.querySelector(".hierarchy-add-element");
    hierarchyAddElementContainer = document.querySelector(".hierarchy-link");

    addElementButton = document.querySelector(".hierarchy-button-plus");
    removeElementButton = document.querySelector(".hierarchy-button-minus");

    hideableComponents = document.querySelector(".hideable-components");

    onChangeComponent = document.querySelector(".on-change");

    addElementButton.onclick = createElement;
    removeElementButton.onclick = removeElement;

    onChangeComponent.onchange = changeComponent;

    transformComponent = transformConstructor();

    transformComponent.position.x.value = 1.0;
    transformComponent.position.y.value = 2.0;
    transformComponent.position.z.value = -1.11;

    updateHierarchy();

    function createElement() {
        const newElement = document.createElement('a');
        const newElementText = document.createTextNode(id.toString());

        newElement.setAttribute("href", "#");
        newElement.appendChild(newElementText);

        newElement.onclick = setAsActive;
        newElement.oncontextmenu = removeElement;

        hierarchyAddElementContainer.appendChild(newElement);
        listDOM.push(newElement);
        id++;

        objectConstructor();

        updateHierarchy();
    }

    function removeElement() {
        if (activeElement === null) {
            return;
        }

        const index = listDOM.indexOf(activeElement);
        if (index > -1) {
            listDOM.splice(index, 1);
            removeObject(index);
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
            const object = objects[index];

            object.translation[0] = transformComponent.position.x.value;
            object.translation[1] = transformComponent.position.y.value;
            object.translation[2] = transformComponent.position.z.value;
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
            const object = objects[index];

            transformComponent.position.x.value = object.translation[0];
            transformComponent.position.y.value = object.translation[1];
            transformComponent.position.z.value = object.translation[2];
        }

    }
}

setup();
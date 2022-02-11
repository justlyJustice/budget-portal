import React, { useState, useRef, useEffect } from "react";

function DragNDrop({ data, setData }) {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);

  // useEffect(() => {
  //   setList(data);
  // }, [setList, data]);

  const dragItem = useRef();
  const dragItemNode = useRef();

  const handletDragStart = (e, item) => {
    console.log("Starting to drag", item);

    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener("dragend", handleDragEnd);
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e, targetItem) => {
    console.log("Entering a drag target", targetItem);

    if (dragItemNode.current !== e.target) {
      console.log("Target is NOT the same as dragged item");
      setData((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[targetItem.grpI].items.splice(
          targetItem.itemI,
          0,
          newList[dragItem.current.grpI].items.splice(
            dragItem.current.itemI,
            1
          )[0]
        );
        dragItem.current = targetItem;
        localStorage.setItem("List", JSON.stringify(newList));
        return newList;
      });
    }
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener("dragend", handleDragEnd);
    dragItemNode.current = null;
  };

  const getStyles = (item) => {
    if (
      dragItem.current.grpI === item.grpI &&
      dragItem.current.itemI === item.itemI
    ) {
      return "dnd-item current";
    }
    return "dnd-item";
  };

  if (list) {
    return (
      <div className="drag-n-drop">
        {data.map((grp, grpI) => (
          <div
            key={grp.title}
            onDragEnter={
              dragging && !grp.items.length
                ? (e) => handleDragEnter(e, { grpI, itemI: 0 })
                : null
            }
            className="dnd-group"
          >
            <div>
              <h4 className="group-title">{grp.title}</h4>

              {grp.items.map((item, i) => (
                <div
                  className="dnd-item"
                  draggable
                  onDragStart={
                    dragging && !grp.items.length
                      ? (e) => handletDragStart(e, { item, i: 0 })
                      : null
                  }
                >
                  <>
                    <h5>{item.amount}</h5> <br />
                    <p>{item.beneficiary}</p>
                    <span>{item.description}</span>
                  </>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}

export default DragNDrop;

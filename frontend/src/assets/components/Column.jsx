import React from "react";
import styled from "styled-components";
import Task from "./Task";
import "./scroll.css";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  background-color: #343434;
  border-radius: 2.5px;
  width: 100%;
  min-width: 12rem
`;

const Title = styled.h3`
  padding: 8px;
  background-color: pink;
  text-align: center;
`;

const TaskList = styled.div`
  padding: 3px;
  transistion: background-color 0.2s ease;
  background-color: #343434;
  flex-grow: 1;
  height: 99%
`;

export default function Column({ clickAction, delAction, title, tasks, id }) {
  return (
    <Container className="column">
      <Title
        style={{
          backgroundColor: "#181818",
          position: "sticky",
          color:'white'
        }}
      >
        {title}
      </Title>
      <div className="droppableContainer">
        <Droppable style={{height:'100%'}} droppableId={id}>
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {tasks.map((task, index) => (
                <Task status={id} delAction={(taskId) => { delAction(taskId, id) }} handleEdit={(taskId) => { clickAction(id, taskId) }} key={index} index={index} task={task} />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </div>
    </Container>
  );
}

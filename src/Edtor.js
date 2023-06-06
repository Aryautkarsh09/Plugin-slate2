import React, { useState, useCallback } from "react";

import { createEditor, Transforms, Editor, Range,Node } from "slate";

import { Slate, Editable, withReact } from "slate-react";
import CollapsibleButton from "./CollapseButton.js"
export default function MyEditor() {
  const [initialValue, setInitialvalue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);
  const [codebutton, setcodebutton] = useState(false);
  const [editor] = useState(() => withReact(createEditor()));

  function codeb() {
    if (codebutton == false) {
      setcodebutton(true);
      Transforms.insertNodes(editor, {
        type: "codei",
        children: [{ text: "" }],
      });
    } else {
      setcodebutton(false);
      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: [{ text: "" }],
      });
    }
  }

  const renderElement = useCallback(({ attributes, children, element }) => {
    switch (element.type) {
      case "codei":
        return (
          <pre
            {...attributes}
            style={{
              fontFamily: "Sans-serif",
              color: "red",
              backgroundColor: "black",
              margin: "0px",
            }}
          >
            {children}
          </pre>
        );
        case  'table':
            return(
              <table {...attributes} style = {{width:"100%" ,border:"1px solid"}}>{children}</table>


            );
        case 'table-rows':
            return(
              <tr {...attributes} style = {{border:"1px solid"}}>{children}</tr>

            );
         case 'table-col':
          return(
            <td {...attributes} style = {{border:"1px solid"}}>{children}</td>
          )   
          case 'Body':
            return(
              <tbody {...attributes}>{children}</tbody>
            )
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);
  const ele = [
{
data :{
row:2,
col : 2
},
type : 'table',
children:[{type : 'Body',children : [{type : 'table-rows',
children : [{type : 'table-col',children :[{type : 'paragraph',children:[{text:'2'}]}]},{type : 'table-col',children :[{type : 'paragraph',children:[{text:'1'}]}]}]},
{type : 'table-rows',
children : [{type : 'table-col',children :[{type : 'paragraph',children:[{text:'3'}]}]},{type : 'table-col',children :[{type : 'paragraph',children:[{text:'4'}]}]}]}]
}]


}



  ]
function Table(){

Transforms.insertNodes(editor,ele);

}
function InsertRow(){
const path = editor.selection.anchor.path;
let a = path.length;
let b = [];
for(let i = 0;i<a-3;i++){
b.push(path[i]);
}
const [table1,pathtable] = Editor.above(editor,{at : path,match : (node)=>{
 return(node.type == 'table')
},mode : 'lowest'});
console.log(pathtable);

const [s,e] = Editor.edges(editor, pathtable);

let ncol = e.path[e.path.length-3]+1;
const [lastrow,pathlastrow] = Editor.above(editor,{at : e.path,match : (node)=>{
  return (node.type == 'table-rows')
},mode : 'lowest'})

const row1 = {type : 'table-rows',children : []};
for(let i = 0;i<ncol;i++){
row1.children.push({type : 'table-col',children :[{type : 'paragraph',children:[{text:'3'}]}]})
}

b[a-4]+=1;
pathlastrow[pathlastrow.length-1]+=1;
Transforms.insertNodes(editor,row1,{at : pathlastrow});

}


function DeleteRow(){
const selectedP = editor.selection.path;
const[delrow,pathdelrow] = Editor.above(editor,{at : selectedP,match : (node)=>{
  return (node.type == 'table-rows')
},mode :'lowest' });

Transforms.removeNodes(editor,{at : pathdelrow});

}
function DeleteCol(){
const selectedP = editor.selection.anchor.path;
const [deltab,pathdeltab] = Editor.above(editor,{at : selectedP,match : (node)=>{
  return (node.type == 'Body')
},mode : 'lowest'});
console.log(deltab);
const[node,path2] = Editor.node(editor,{at : pathdeltab});
for(const[row,rowpath] of Node.children(node,pathdeltab)){
    
const[s,e] = Editor.edges(editor,rowpath);
console.log(e.path);
const[delcol,pathdelcol] = Editor.above(editor,{at : e.path,match : (node)=>{
return (node.type == 'table-col')
},mode : 'lowest'});
Transforms.removeNodes(editor,{at : pathdelcol});
}


}

function insertCol(){

const selectedP = editor.selection.anchor.path;

const [deltab,pathdeltab] = Editor.above(editor,{at : selectedP,match : (node)=>{
  return (node.type == 'Body')
},mode : 'lowest'});


console.log(pathdeltab);
const[node,path1] = Editor.node(editor,{at : pathdeltab});
for(const[noder,path2] of Node.children(node,pathdeltab)){
let ncpath = [];
for(let i = 0;i<path2.length;i++){
  ncpath.push(path2[i]);
}
ncpath.push(noder.children.length);
Transforms.insertNodes(editor,{type : 'table-col',children :[{type : 'paragraph',children:[{text:'3'}]}]},{at : ncpath});

}

}
  return (
    <Slate
    
      editor={editor}
      initialValue={initialValue}
      onChange={(v) => setInitialvalue(v)}
    >
     <CollapsibleButton Table = {Table} codeb = {codeb} insertCol = {insertCol} DeleteCol = {DeleteCol} InsertRow = {InsertRow} DeleteRow = {DeleteRow}/> 
      <Editable
        renderElement={renderElement}
        onKeyDown={(event) => {
          if (event.code == "ArrowDown") {
            const range = editor.selection;

            const b = Editor.end(editor, []);
            let a1 = range.anchor.path.toString;
            let a2 = b.path.toString;
let ins  = [];
ins.push(range.anchor.path[0]+1);
// console.log(ins);
// console.log(editor);
            if (a1 === a2) {
              Transforms.insertNodes(editor, {
                type: "paragraph",
                children: [{ text: "" }],
              }, {at :ins});
            }
          }
        }}
      />
      
      
    </Slate>
  );
}

import react from "react";

export default function (props:{size?:string, content:React.ReactNode, visibility:boolean, hideModal:Function}) {  
	const style = {
		width: props.size,
		height:props.size,
	};

	return <div className={props.visibility ? "modal" : "modal hidden"}>
		<div className="blackBackGround" onClick={function(){props.hideModal()}}></div>
		<div className="content" style={style}>
			{props.content}
		</div>
	</div>
}
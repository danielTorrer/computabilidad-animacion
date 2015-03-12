var cadenaSalida; // 
var separadorLinea = ":" ;
var R = new Array(); // Valores de registro
var lineaActual; // 
var totInstrucciones; // instrucciones ejecutadas

function iniciarVariables(){

	var temp = new Array();
	R = temp;
	cadenaSalida="";
	varRegistradas(R);
	lineaActual=1;
	totInstrucciones=0;
	$('.registros tbody').html('')

	return;

}

function varRegistradas(arr){

	// Valores del registro

	var str= form1.registerValues.value;
	var len; // tamaño de cadena
	var r; // indice
	var i,j,temp;
	
	if(str=="") return;
	//	cadenaSalida += "Input: "
	str=quitarEspacios(str);
	str+="," // ultimo valor
	len=str.length;
	
	for(i=0,r=1; i<len; ){
		if(isNaN(str.charAt(i))){
			alert("Error en registros iniciales: ")
			return;
		}

		j=siguienteNoDigito(str,i);
		arr[r]=temp=Number(str.slice(i,j));
		r++;
		i=j+1; // 
	}

	//	cadenaSalida += "\n\n"

}

function runSim() {

	var lines = new Array();
	var nlines; // lineas totales
	var progStr=form1.progtext.value +")";
	var r, r2; 
	var curPos; 
	var nextPos; 
	var showRegs = true 
	var maxRun = -1
	var nInstructions; 
	var progEnded=false; 

	if( maxRun == -2) return;
	progStr=quitarEspacios(progStr);
	progStr=progStr.toUpperCase();
	nlines=encontrarLineas(lines,progStr);
	if(nlines==0){
		alert("No hay lineas a ejecutar");
		return;			}


	for(nInstructions=0; maxRun==-1 || nInstructions < maxRun; nInstructions++){

		if(lineaActual > nlines || lineaActual==0){
			progEnded=true;
			cadenaSalida += "Detener";
			break;
		}

		curPos=lines[lineaActual];
		if(progStr.charAt(curPos)=="Z"){
			if(progStr.charAt(++curPos)!="("){
				alert("Error en la instrucción " + lineaActual )
					break;
				}

			curPos++; 

				if(isNaN(progStr.charAt(curPos))){
					alert("Error en la instrucción " + lineaActual)
					break;
				}
				nextPos = siguienteNoDigito(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); 
		R[r]=0; // r igual a 0
		if(showRegs) cadenaSalida += lineaActual + ":R" + r + "=" + R[r] + "\n";
		++lineaActual;
	}

	else if(progStr.charAt(curPos)=="S"){

		if(progStr.charAt(++curPos)!="("){
			alert("Error en la instrucción " + lineaActual )
			break;
		}
		curPos++; 
		if(isNaN(progStr.charAt(curPos))){
			alert("Error en la instrucción " + lineaActual )
			break;
		}
		
		nextPos = siguienteNoDigito(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); 
		if(R[r]==null) R[r]=0; 
		
		R[r]+=1; 
		
		if(showRegs) cadenaSalida += lineaActual + ":R" + r + "=" + R[r] + "\n";
		
		++lineaActual;
	}

	else if(progStr.charAt(curPos)=="T"){

		if(progStr.charAt(++curPos)!="("){
			alert("Error en la instrucción " + lineaActual )
			break;
		}
		curPos++; 
		if(isNaN(progStr.charAt(curPos))){
			alert("Error en la instrucción " + lineaActual )
			break;
		}

		nextPos = siguienteNoDigito(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); 
		curPos=nextPos;
		
		if(progStr.charAt(curPos)!=","){
			alert("Error en la instrucción " + lineaActual )
			break;
		}
		
		curPos++; 
		nextPos = siguienteNoDigito(progStr,curPos);
		
		r2=Number(progStr.slice(curPos,nextPos)); 
		
		if(R[r]==null) R[r]=0; 
		if(R[r2]==null) R[r2]=0; 
		
		R[r2]=R[r]; 
		
		if(showRegs) cadenaSalida += lineaActual + ":R" + r2 + "=" + R[r2] + "\n";
		
		++lineaActual;
	}

	else if(progStr.charAt(curPos)=="J"){
		if(progStr.charAt(++curPos)!="("){
			alert("Error en la instrucción " + lineaActual )
			break;
		}
	
		curPos++;
	
		if(isNaN(progStr.charAt(curPos))){
			alert("Error en la instrucción " + lineaActual )
			break;
		}

		nextPos = siguienteNoDigito(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); 

		curPos=nextPos;
		if(progStr.charAt(curPos)!=","){
			alert("Error en la instrucción " + lineaActual )
			break;
		}
		
		curPos++; 
		nextPos = siguienteNoDigito(progStr,curPos);
		r2=Number(progStr.slice(curPos,nextPos)); 

		if(R[r]==null) R[r]=0; 
		if(R[r2]==null) R[r2]=0; 
		if(R[r2]!=R[r]){ 
			if(showRegs) cadenaSalida += lineaActual + ":No salto\n";
			++lineaActual;
			continue;
		}
		
		curPos=nextPos;
		if(progStr.charAt(curPos)!=","){
			alert("Error en la instrucción " + lineaActual)
			break;
		}
		
		curPos++; 
		nextPos = siguienteNoDigito(progStr,curPos);
		nextLine=Number(progStr.slice(curPos,nextPos)); 
		if(showRegs) cadenaSalida += lineaActual + ":Salto a " + nextLine + "\n";
			lineaActual=nextLine;
		}

		else {
			alert("Error en la instrucción " + lineaActual)
			break;
		}	

		crearFila()

	} //   main loop
	
	totInstrucciones += nInstructions; 

	if(!progEnded){

	}
	else{
		if(R[1]==null) R[1]=0; 
		cadenaSalida = ("Salida: R1="+R[1]+"\n\n" + "Ejecutadas " + totInstrucciones + "instrucciones:\n\n").concat(cadenaSalida); 
	}
	
	form1.progoutput.value=cadenaSalida;
}

function crearFila(){
	var html = ''
	html += '<tr>'
	for(var j = 1; j <= 10; j++ ){
		html+= '<th>'
		html+= R[j]
		html+= '</th>'
	}

	html += '</tr>'

	$('.registros tbody').append(html)
}

function quitarEspacios(str){

	str=str.replace(/ /g,"");
	str=str.replace(/\n/g,"");
	str=str.replace(/\r/g,"");
	str=str.replace(/\t/g,"");
	return(str);

}

function siguienteNoDigito(str,inicio){

	var fin=inicio;
	while(! isNaN(str.charAt(fin))){
		fin++;
	}
	return(fin);

}


function encontrarLineas(lines,progStr){

	var pos=0;
	var line=0;
	while( (pos=sigLinea(progStr,pos)) != -1 ){
		lines[++line]=pos;
	}
	return(line);
}

function sigLinea(str,pos){

	while(str.charAt(pos)!=separadorLinea){
		if(pos >= str.length) return(-1);
		pos++;
	}
	
	return(++pos);

}

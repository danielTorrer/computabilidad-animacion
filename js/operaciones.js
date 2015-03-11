var cadenaSalida; // 
var separadorLinea = ":" ;
var R = new Array(); // Valores de registro
var lineaActual; // current number line in main for loop
var totInstrucciones; // holds total # of performed instructions

function initializeVars(){

	var temp = new Array();
	R = temp;
	cadenaSalida="";
	recordRegisterVals(R);
	lineaActual=1;
	totInstrucciones=0;
	$('.registros tbody').html('')

	return;

}

function recordRegisterVals(arr){

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
		arr[r]=temp=Number(str.slice(i,j)); // record register value
		//		cadenaSalida += "R" + r + "=" + temp + "; "
		r++;
		i=j+1; // set i to one after the comma
	}

	//	cadenaSalida += "\n\n"

}

function runSim() {
	// runs the simulation

	var lines = new Array();
	var nlines; // lineas totales
	var progStr=form1.progtext.value +")";
	var r, r2; // hold register numbers
	var curPos; // holds current position being read in progStr
	var nextPos; // temporarily holds next value of curPos
	var showRegs = true //form1.showRegisters[0].checked; // true if Y is checked
	var maxRun; // maximum number of instructions to perform
	var nInstructions; // number of performed instructions
	var progEnded=false; // is set to true if prog reaches end

	if( (maxRun=getMaxRun() ) == -2) return;
	progStr=quitarEspacios(progStr);
	progStr=progStr.toUpperCase();
	nlines=findLines(lines,progStr);
	if(nlines==0){
		alert("No readable program lines were found.");
		return;			}


	for(nInstructions=0; maxRun==-1 || nInstructions < maxRun; nInstructions++){

		if(lineaActual > nlines || lineaActual==0){
			progEnded=true;
			cadenaSalida += "Stop";
			break;
		}

		curPos=lines[lineaActual];
		if(progStr.charAt(curPos)=="Z"){
			if(progStr.charAt(++curPos)!="("){
				alert("Error in instruction " + lineaActual + ":\n Z must be followed by (")
					break;
				}

			curPos++; // skip the (

				if(isNaN(progStr.charAt(curPos))){
					alert("Error in instruction " + lineaActual + 
						":\n non-digit found where digit expected.")
					break;
				}
				nextPos = siguienteNoDigito(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); // the register number
		R[r]=0; // set register r to 0
		if(showRegs) cadenaSalida += lineaActual + ":R" + r + "=" + R[r] + "\n";
		++lineaActual;
	}

	else if(progStr.charAt(curPos)=="S"){

		if(progStr.charAt(++curPos)!="("){
			alert("Error in instruction " + lineaActual + ":\n S must be followed by (")
			break;
		}
		curPos++; // skip the (
		if(isNaN(progStr.charAt(curPos))){
			alert("Error in instruction " + lineaActual + ":\n non-digit found where digit expected.")
			break;
		}
		
		nextPos = siguienteNoDigito(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); // the register number
		if(R[r]==null) R[r]=0; // if not set yet, set to zero
		
		R[r]+=1; // increment register r
		
		if(showRegs) cadenaSalida += lineaActual + ":R" + r + "=" + R[r] + "\n";
		
		++lineaActual;
	}

	else if(progStr.charAt(curPos)=="T"){

		if(progStr.charAt(++curPos)!="("){
			alert("Error in instruction " + lineaActual + ":\n T must be followed by (")
			break;
		}
		curPos++; // skip the (
		if(isNaN(progStr.charAt(curPos))){
			alert("Error in instruction " + lineaActual + ":\n non-digit found where digit expected.")
			break;
		}

		nextPos = siguienteNoDigito(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); // the register number
		curPos=nextPos;
		
		if(progStr.charAt(curPos)!=","){
			alert("Error in instruction " + lineaActual + ":\n comma expected after first register number")
			break;
		}
		
		curPos++; // skip the comma
		nextPos = siguienteNoDigito(progStr,curPos);
		
		r2=Number(progStr.slice(curPos,nextPos)); // the second register number
		
		if(R[r]==null) R[r]=0; // if not set yet, set to zero
		if(R[r2]==null) R[r2]=0; // if not set yet, set to zero
		
		R[r2]=R[r]; // set register r2 equal to register r
		
		if(showRegs) cadenaSalida += lineaActual + ":R" + r2 + "=" + R[r2] + "\n";
		
		++lineaActual;
	}

	else if(progStr.charAt(curPos)=="J"){
		if(progStr.charAt(++curPos)!="("){
			alert("Error in instruction " + lineaActual + ":\n J must be followed by (")
			break;
		}
	
		curPos++; // skip the (
	
		if(isNaN(progStr.charAt(curPos))){
			alert("Error in instruction " + lineaActual + ":\n non-digit found where digit expected.")
			break;
		}

		nextPos = siguienteNoDigito(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); // the register number

		curPos=nextPos;
		if(progStr.charAt(curPos)!=","){
			alert("Error in instruction " + lineaActual + ":\n comma expected after first register number")
			break;
		}
		
		curPos++; // skip the comma
		nextPos = siguienteNoDigito(progStr,curPos);
		r2=Number(progStr.slice(curPos,nextPos)); // the second register number

		if(R[r]==null) R[r]=0; // if not set yet, set to zero
		if(R[r2]==null) R[r2]=0; // if not set yet, set to zero
		if(R[r2]!=R[r]){ // jump condition not satisfied
			if(showRegs) cadenaSalida += lineaActual + ":No jump\n";
			++lineaActual;
			continue;
		}
		
		curPos=nextPos;
		if(progStr.charAt(curPos)!=","){
			alert("Error in instruction " + lineaActual + ":\n comma expected after first register number")
			break;
		}
		
		curPos++; // skip the comma
		nextPos = siguienteNoDigito(progStr,curPos);
		nextLine=Number(progStr.slice(curPos,nextPos)); // the line number to jump to
		if(showRegs) cadenaSalida += lineaActual + ":Jump to " + nextLine + "\n";
			lineaActual=nextLine;
		}

		else {
			alert("Error in instruction " + lineaActual + ":\n Must use Z, S, T, or J.")
			break;
		}	

		crearFila()

	} // end of main for loop
	
	totInstrucciones += nInstructions; // update totInstrucciones

	if(!progEnded){
		// if end of program was not reached,
		// then enable the continue button
		//form1.continueButton.disabled=false;
		alert("Did not reach end of program; "+
			nInstructions + " instructions were performed during last run, " +
			"totalling " + totInstrucciones + " so far.\n" +
			"To continue, click the Continue button.\n\n");
	}
	else{
		if(R[1]==null) R[1]=0; // if R1 not set yet, set to zero
		cadenaSalida = ("Output: R1="+R[1]+"\n\n" + "Performed " + totInstrucciones + "instructions:\n\n").concat(cadenaSalida); // prepend with output
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

function getMaxRun(){
	// reads value from "Stop after ____ instructions."
	// returns -1 if ""
	// returns -2 if invalid input


	var str= ""

	if(str=="") return(-1);
	if(isNaN(str) || !(Number(str)>0) ){
		alert("Need positive integer for\n" + "Stop after ____ instructions.");
		return(-2);
	}
	return(Number(str));
}






function quitarEspacios(str){

	// Removes all spaces from str
	// does not remove tabs or newlines

	str=str.replace(/ /g,"");
	str=str.replace(/\n/g,"");
	str=str.replace(/\r/g,"");
	str=str.replace(/\t/g,"");
	return(str);

}

function siguienteNoDigito(str,beg){

	// finds next non-digit character in str after beg
	// Assumes there is a digit char at str[beg].
	// Assumes there eventually is a non-digit char before passing end of str.

	var end=beg;
	while(! isNaN(str.charAt(end))){
		end++;
	}
	return(end);

}


function findLines(lines,progStr){

	// Find positions of all lines in progStr
	// and record in the array lines
	// lines[0] is unused
	// returns number of lines found

	var pos=0;
	var line=0;
	while( (pos=findNextLine(progStr,pos)) != -1 ){
		lines[++line]=pos;
	}
	return(line);
}

function findNextLine(str,pos){

	// starts searching at current position pos
	// until finds separadorLinea
	// then returns the position immediately after the found .

	while(str.charAt(pos)!=separadorLinea){
		if(pos >= str.length) return(-1);
		pos++;
	}
	
	return(++pos);

}


function updateStopStatus(){

	// Enable or disable the stop text box
	// according to whether the checkStop button is
	// checked or not

	/*if(form1.stopCheck.checked){
		form1.stop.disabled=false;
	}
	else form1.stop.disabled=true;*/

}







function showExample(){
// Display example in the INPUT column

form1.progtext.value =
"1:J(2,3,0)" +
"\n2:S(1)        May comment anywhere." +
"\n :S(3)        Line numbers are optional." +
"\n4: J( 1,1,1)  Spaces are ignored." +
"\n\n-Must use colon before each instruction." +
"\n-Never use colons in comments." +
"\n\n\nThis program adds registers 1 & 2." +
"\nClick Run to see output.";

form1.registerValues.value="5, 8" ;
return;

}
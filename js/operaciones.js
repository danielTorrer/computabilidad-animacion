var outStr; // to be written to the output text box
var LINE_INDICATOR = ":" ;
var R = new Array(); // holds Register values
var curLine; // current number line in main for loop
var stopWin; // ref to child window for interrupting program
var totInstructions; // holds total # of performed instructions

/*function makeStopWindow(){
	// Open a new window that allows user to stop program in original window

	var tempstr;
	tempstr='<html><head><title></title></head>';
	tempstr+='<body><form name="form2">';
	tempstr+='<input type="button" ';
	tempstr+='value="Interrupt program" onClick="form2.stopRequest.value=';
	tempstr+="'yes'";
	tempstr+=' ;" >';
	//	tempstr+="<br>This window closes automatically. Closing it manually stops the program.";
	tempstr+='<input type="hidden" name="stopRequest" value="no">';
	tempstr+='</form></body></html>';

	if(stopWin!=null) stopWin.close();
	
	stopWin = window.open("","","width=180,height=30,resizable");
	stopWin.document.write(tempstr);
	stopWin.document.close();

}*/

function initializeVars(){

	// resets all registers to null
	// in preparation for runSim()
	// This function is called by the Run button,
	// and not by the Continue button.

	var temp = new Array();
	R = temp;
	outStr="";
	recordRegisterVals(R);
	//form1.continueButton.disabled=true;
	curLine=1;
	totInstructions=0;
	$('.registros tbody').html('')

	return;

}

function recordRegisterVals(arr){

	// Record numbers from form1.registerValues.value into arr
	// register values assumed to be comma-separated
	// arr[0] not used
	// record actions in outStr

	var str= form1.registerValues.value;
	var len; // holds length of str
	var r; // index for arr
	var i,j,temp;
	
	if(str=="") return;
	//	outStr += "Input: "
	str=removeSpaces(str);
	str+="," // adhoc: so slice will work for last value
	len=str.length;
	
	for(i=0,r=1; i<len; ){
		if(isNaN(str.charAt(i))){
			alert("Error in Initial register values: " + "non-digit found where digit expected.")
			return;
		}

		j=findNextNonDigit(str,i);
		arr[r]=temp=Number(str.slice(i,j)); // record register value
		//		outStr += "R" + r + "=" + temp + "; "
		r++;
		i=j+1; // set i to one after the comma
	}

	//	outStr += "\n\n"

}

function runSim() {
	// runs the simulation

	var lines = new Array();
	var nlines; // number of lines in program
	var progStr=form1.progtext.value +")";
	// adhoc: add ) for progStr.slice to work in case last ) is missing
	var r, r2; // hold register numbers
	var curPos; // holds current position being read in progStr
	var nextPos; // temporarily holds next value of curPos
	var showRegs = true //form1.showRegisters[0].checked; // true if Y is checked
	var maxRun; // maximum number of instructions to perform
	var nInstructions; // number of performed instructions
	var progEnded=false; // is set to true if prog reaches end

	if( (maxRun=getMaxRun() ) == -2) return;
	progStr=removeSpaces(progStr);
	progStr=progStr.toUpperCase();
	nlines=findLines(lines,progStr);
	if(nlines==0){
		alert("No readable program lines were found.");
		return;			}

	//makeStopWindow();

	for(nInstructions=0; maxRun==-1 || nInstructions < maxRun; nInstructions++){
		/*if(stopWin.form2.stopRequest.value=="yes"){
			break;
		}*/
		if(curLine > nlines || curLine==0){
			progEnded=true;
			//form1.continueButton.disabled=true;
			outStr += "Stop";
			break;
		}

		curPos=lines[curLine];
		if(progStr.charAt(curPos)=="Z"){
			if(progStr.charAt(++curPos)!="("){
				alert("Error in instruction " + curLine + ":\n Z must be followed by (")
					break;
				}

			curPos++; // skip the (

				if(isNaN(progStr.charAt(curPos))){
					alert("Error in instruction " + curLine + 
						":\n non-digit found where digit expected.")
					break;
				}
				nextPos = findNextNonDigit(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); // the register number
		R[r]=0; // set register r to 0
		if(showRegs) outStr += curLine + ":R" + r + "=" + R[r] + "\n";
		++curLine;
	}

	else if(progStr.charAt(curPos)=="S"){

		if(progStr.charAt(++curPos)!="("){
			alert("Error in instruction " + curLine + ":\n S must be followed by (")
			break;
		}
		curPos++; // skip the (
		if(isNaN(progStr.charAt(curPos))){
			alert("Error in instruction " + curLine + ":\n non-digit found where digit expected.")
			break;
		}
		
		nextPos = findNextNonDigit(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); // the register number
		if(R[r]==null) R[r]=0; // if not set yet, set to zero
		
		R[r]+=1; // increment register r
		
		if(showRegs) outStr += curLine + ":R" + r + "=" + R[r] + "\n";
		
		++curLine;
	}

	else if(progStr.charAt(curPos)=="T"){

		if(progStr.charAt(++curPos)!="("){
			alert("Error in instruction " + curLine + ":\n T must be followed by (")
			break;
		}
		curPos++; // skip the (
		if(isNaN(progStr.charAt(curPos))){
			alert("Error in instruction " + curLine + ":\n non-digit found where digit expected.")
			break;
		}

		nextPos = findNextNonDigit(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); // the register number
		curPos=nextPos;
		
		if(progStr.charAt(curPos)!=","){
			alert("Error in instruction " + curLine + ":\n comma expected after first register number")
			break;
		}
		
		curPos++; // skip the comma
		nextPos = findNextNonDigit(progStr,curPos);
		
		r2=Number(progStr.slice(curPos,nextPos)); // the second register number
		
		if(R[r]==null) R[r]=0; // if not set yet, set to zero
		if(R[r2]==null) R[r2]=0; // if not set yet, set to zero
		
		R[r2]=R[r]; // set register r2 equal to register r
		
		if(showRegs) outStr += curLine + ":R" + r2 + "=" + R[r2] + "\n";
		
		++curLine;
	}

	else if(progStr.charAt(curPos)=="J"){
		if(progStr.charAt(++curPos)!="("){
			alert("Error in instruction " + curLine + ":\n J must be followed by (")
			break;
		}
	
		curPos++; // skip the (
	
		if(isNaN(progStr.charAt(curPos))){
			alert("Error in instruction " + curLine + ":\n non-digit found where digit expected.")
			break;
		}

		nextPos = findNextNonDigit(progStr,curPos);
		r=Number(progStr.slice(curPos,nextPos)); // the register number

		curPos=nextPos;
		if(progStr.charAt(curPos)!=","){
			alert("Error in instruction " + curLine + ":\n comma expected after first register number")
			break;
		}
		
		curPos++; // skip the comma
		nextPos = findNextNonDigit(progStr,curPos);
		r2=Number(progStr.slice(curPos,nextPos)); // the second register number

		if(R[r]==null) R[r]=0; // if not set yet, set to zero
		if(R[r2]==null) R[r2]=0; // if not set yet, set to zero
		if(R[r2]!=R[r]){ // jump condition not satisfied
			if(showRegs) outStr += curLine + ":No jump\n";
			++curLine;
			continue;
		}
		
		curPos=nextPos;
		if(progStr.charAt(curPos)!=","){
			alert("Error in instruction " + curLine + ":\n comma expected after first register number")
			break;
		}
		
		curPos++; // skip the comma
		nextPos = findNextNonDigit(progStr,curPos);
		nextLine=Number(progStr.slice(curPos,nextPos)); // the line number to jump to
		if(showRegs) outStr += curLine + ":Jump to " + nextLine + "\n";
			curLine=nextLine;
		}

		else {
			alert("Error in instruction " + curLine + ":\n Must use Z, S, T, or J.")
			break;
		}	

		crearFila()

	} // end of main for loop
	

	//stopWin.close();

	totInstructions += nInstructions; // update totInstructions

	if(!progEnded){
		// if end of program was not reached,
		// then enable the continue button
		//form1.continueButton.disabled=false;
		alert("Did not reach end of program; "+
			nInstructions + " instructions were performed during last run, " +
			"totalling " + totInstructions + " so far.\n" +
			"To continue, click the Continue button.\n\n");
	}
	else{
		if(R[1]==null) R[1]=0; // if R1 not set yet, set to zero
		outStr = ("Output: R1="+R[1]+"\n\n" + "Performed " + totInstructions + "instructions:\n\n").concat(outStr); // prepend with output
	}
	
	form1.progoutput.value=outStr;
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






function removeSpaces(str){

	// Removes all spaces from str
	// does not remove tabs or newlines

	str=str.replace(/ /g,"");
	str=str.replace(/\n/g,"");
	str=str.replace(/\r/g,"");
	str=str.replace(/\t/g,"");
	return(str);

}

function findNextNonDigit(str,beg){

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
	// until finds LINE_INDICATOR
	// then returns the position immediately after the found .

	while(str.charAt(pos)!=LINE_INDICATOR){
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
/**
 * 
 * See: 
 * https://react.dev/learn/choosing-the-state-structure
 * https://mauriciopoppe.github.io/function-plot/
 * https://stackoverflow.com/questions/65828870/plotting-a-function-in-react-with-dynamic-input
 * https://snipcart.com/blog/reactjs-wordpress-rest-api-example
 */
import React, { useEffect, useState } from 'react';
import functionPlot from 'function-plot'

const std_tp = 36.5;
const std_ph = 7.4;
const std_paco2 = 40;
//const std_pao2 = 84;

export default function HemoglobinOxygenSaturationCurve() {
	var hbCurveShift = 1;
	const [tp, setTp] = useState(std_tp);
	const [ph, setPh] = useState(std_ph);
	const [paco2, setPaco2] = useState(std_paco2);
	
	function handleTpChange(e) {
		setTp(e.target.value);
	}
	function handlePhChange(e) {
		setPh(e.target.value);
	}
	function handlePaco2Change(e) {
		setPaco2(e.target.value);
	}
	function handleSubmit(e) {
		plotMe();
	}
	function handleReset(e) {
		setTp(std_tp);
		setPh(std_ph);
		setPaco2(std_paco2);
		handleSubmit(e);
	}

	function calcHbCurveShift(tp, ph, paco2) {
		return 10**(0.024 * (std_tp - tp) + 0.40*(ph - std_ph) + 0.06*(Math.log10(std_paco2) - Math.log10(paco2))); 
	}
	
	function hbCurve(pao2, hbCurveShift) {
		var thispo2 = pao2 * hbCurveShift; 
	    var sat = 1 / (1 + 23400 * (Math.pow((Math.pow(thispo2, 3) + 150 * thispo2), -1)));
	    return sat * 100;
	}
	
	function plotMe() {
		//hbCurveShift = calcHbCurveShift(std_tp-2, std_ph, std_paco2);
		hbCurveShift = calcHbCurveShift(tp, ph, paco2);
		functionPlot({
			target: '#hbCurve',
			width: 580,
			height: 400,
			tip: {
				xLine: true,    // dashed line parallel to y = 0
				yLine: true,    // dashed line parallel to x = 0
			},
			yAxis: {
				label: 'SpO2 %',
				domain: [0, 100]
			},
			xAxis: {
				label: 'PaO2 mmHg',
				domain: [0, 110]
			},
			data: [
				{ graphType: 'polyline', fn: function(scope) { return hbCurve(scope.x, 1) }, color: 'red' },
				{ graphType: 'polyline', fn: function(scope) { return hbCurve(scope.x, hbCurveShift) }, color: 'blue' }
			],
			disableZoom: true,
			grid: true
		});
	}
	
	useEffect(() => {
		plotMe();
	}, [])
	
	return (
		<div className="App">
			<h1>Oxygen/Hemoglobin Dissociation Curve</h1>
			<h3>Oxygen saturation percent (SpO2 %) based on arterial partial pressure of oxygen (PaO2)</h3>
			<table class='inputTable'>
				<tr><td>
					<label>
						Body Temp:
						<input
							value={tp}
							onChange={handleTpChange}
						/>
					</label>
				</td></tr>
				<tr><td>
					<label>
						Boold Ph:
						<input
							value={ph}
							onChange={handlePhChange}
						/>
					</label>
				</td></tr>
				<tr><td>
					<label>
						Arterial partial pressure CO2:
						<input
							value={paco2}
							onChange={handlePaco2Change}
						/>
					</label>
				</td></tr>
				<tr><td>
					<button onClick={handleSubmit}>Submit</button>
					<button onClick={handleReset}>Reset</button>
				</td></tr>
			</table>
			<p />
			<div id="hbCurve"></div>
		</div>
	);
}
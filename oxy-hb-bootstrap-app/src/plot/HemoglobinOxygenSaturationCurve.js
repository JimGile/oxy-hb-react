/**
 * 
 * See: 
 * https://react.dev/learn/choosing-the-state-structure
 * https://mauriciopoppe.github.io/function-plot/
 * https://stackoverflow.com/questions/65828870/plotting-a-function-in-react-with-dynamic-input
 * https://snipcart.com/blog/reactjs-wordpress-rest-api-example
 */
import React, { useEffect, useState } from 'react';
import functionPlot from 'function-plot';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const std_tp = 36.5;
const std_ph = 7.4;
const std_paco2 = 40;
const std_pao2 = 92;

export default function HemoglobinOxygenSaturationCurve() {
	var hbCurveShift = 1;
	const [tp, setTp] = useState(std_tp);
	const [ph, setPh] = useState(std_ph);
	const [paco2, setPaco2] = useState(std_paco2);

	// const stdDatum = {
	// 	fn: function(scope) { return hbCurve(scope.x, 1) }
	// }

	
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
			width: 700,
			height: 500,
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
			annotations: [{
				x: std_pao2,
				text: 'Standard PaO2'
			  },
			  {
				y: 50,
				text: 'p50'
			  }
			],			
			disableZoom: true,
			grid: true
		});
	}
	
	useEffect(() => {
		plotMe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	
	return (
		<div className="App">
            <header className="App-header">
                <h1>Oxygen/Hemoglobin Dissociation Curve</h1>
                <h4>Oxygen saturation percent (SpO2 %) based on arterial partial pressure of oxygen (PaO2)</h4>
            </header>

            <Row className="mb-4 row"></Row>

            <Row className="mb-3 row">
                <Col sm="4">
                    <h5>Input Values</h5>
                    <Form>
                        <Form.Group as={Row} className="mb-1" controlId="formTp">
                            <Form.Label column sm="8">Body Temp:</Form.Label>
                            <Col sm="4"><Form.Control value={tp} onChange={handleTpChange} /></Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formPh">
                            <Form.Label column sm="8">Boold Ph:</Form.Label>
                            <Col sm="4"><Form.Control value={ph} onChange={handlePhChange} /></Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formPaco2">
                            <Form.Label column sm="8">Arterial partial pressure CO2:</Form.Label>
                            <Col sm="4"><Form.Control value={paco2} onChange={handlePaco2Change} /></Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formButtons">
                            <Col sm="8"><Button onClick={handleReset}>Reset</Button></Col>
                            <Col sm="4"><Button onClick={handleSubmit}>Submit</Button></Col>
                        </Form.Group>
                    </Form>
                </Col>
                <Col sm="8">
                    <div id="hbCurve"></div>
                </Col>
            </Row>
		</div>
	);
}
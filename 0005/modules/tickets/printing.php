<?php

require_once '../../vendor/tcpdf_min/tcpdf.php';

$post = $_POST['post'];

//TODO first
// sort seats
//

$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, [82,51], true, 'UTF-8', false);

$pdf->SetFont('courier');
$pdf->SetPrintHeader(false);
$pdf->SetPrintFooter(false);
$pdf->SetMargins(0, 0, 0, true);

foreach ($post['seats'] as $k=>$v)
{

	$pdf->AddPage('L');

	$pdf->SetFontSize(14);

	// Cell(w, h, text, )
	$pdf->Cell(32, 0, $k, 0, 2);
	// $pdf->SetFontSize(8);
	// $pdf->Cell(0, 0, $post['showtime']['IntTitle'], 0, 2);

	// $pdf->Cell(10, 0, $post['showtime']['room'], 0, 0);
	// $pdf->Cell(0, 0, $post['showtime']['start'], 0, 1);
	
	// $pdf->Cell(0, 0, $post['showtime']['format'], 0, 2);
	// $pdf->Cell(0, 0, $post['showtime']['date'], 0, 2);
	// $pdf->Cell(0, 0, $post['profile']['fullName'], 0, 2);
}

$filename = time();

$pdf->Output ( __DIR__ . '/../../tmp/' . $filename . '.pdf', 'F');

echo json_encode([ 'filename'=>$filename ]);
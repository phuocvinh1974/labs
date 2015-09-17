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

	//lien 1
	$pdf->SetFontSize(8);
	$pdf->Text(0, 0, date('d m Y', strtotime($post['showtime']['date'])));
	$pdf->Text(20, 0,  date('H:i', mktime(0, $post['showtime']['start'])));
	$pdf->Text(0, 2, $post['showtime']['IntTitle']);
	$pdf->Text(0, 4, $k);
	$pdf->Text(10, 4, $v['type']);
	$pdf->Text(0, 6, $post['showtime']['room']);
	$pdf->Text(0, 8, $v['price']);
	$pdf->Text(0, 10, $post['profile']['fullName']);
}

$filename = time();

$pdf->Output ( __DIR__ . '/../../tmp/' . $filename . '.pdf', 'F');

echo json_encode([ 'filename'=>$filename ]);
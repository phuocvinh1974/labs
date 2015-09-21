<?php

require_once '../../vendor/tcpdf_min/tcpdf.php';

$post = $_POST['post'];

//TODO first
// sort seats
//

$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, [82,51], true, 'UTF-8', false);


$pdf->SetPrintHeader(false);
$pdf->SetPrintFooter(false);
$pdf->SetMargins(0, 0, 0, true);
$pdf->SetAutoPageBreak(true, 0);

foreach ($post['seats'] as $k=>$v)
{
	$pdf->AddPage('L');

	//lien 1
	$pdf->SetFont('courier', 'B');
	$pdf->SetFontSize(8);
	$pdf->Text(0, 0, $post['showtime']['shortTitle']);
	$pdf->Text(0, 3, date('d m Y', strtotime($post['showtime']['date'])));
	$pdf->Text(20, 3,  date('H:i', mktime(0, $post['showtime']['start'])));
	$pdf->Text(0, 6, 'seat: ' . $k);
	$pdf->Text(18, 6, $v['type']);
	$pdf->Text(0, 9, 'room: ' . $post['showtime']['room']);

	$pdf->Text(0, 12, 'Adult');
	$pdf->Text(0, 15, $v['price']);

	$pdf->Text(0, 18, $post['profile']['fullName']);

	//lien 2
	$pdf->SetFontSize(14);
	$pdf->Text(34, 0, $post['showtime']['shortTitle']);
	$pdf->SetFontSize(10);
	$pdf->Text(34, 5, date('d m Y', strtotime($post['showtime']['date'])));
	$pdf->SetFontSize(14);
	$pdf->Text(58, 4,  date('H:i', mktime(0, $post['showtime']['start'])));

	$pdf->SetFont('courier');
	$pdf->SetFontSize(8);
	$pdf->Text(34, 11, 'Seat');
	$pdf->SetFontSize(14);
	$pdf->SetFont('courier', 'B');
	$pdf->Text(42, 9, $k);

	$pdf->SetFont('courier');
	$pdf->SetFontSize(8);
	$pdf->Text(51, 11, $v['type']=='N' ? 'STANDARD' : 'VIP' );

	$pdf->Text(66, 11, 'P');
	$pdf->SetFont('courier', 'B');
	$pdf->SetFontSize(14);
	$pdf->Text(68, 11, $post['showtime']['room']);

	$pdf->SetFontSize(8);
	$pdf->Text(34, 17, 'Adult');

	$pdf->SetFont('courier');
	$pdf->SetFontSize(14);
	$pdf->Text(44, 15, number_format($v['price'], 0, ',', '.'));

	$pdf->SetFontSize(8);
	$pdf->Text(34, 21, 'Mem-No: 00025 Point: 120');

	$pdf->SetFontSize(8);
	$pdf->Text(34, 35,  $post['profile']['fullName']);

}

$filename = time();

$pdf->Output ( __DIR__ . '/../../tmp/' . $filename . '.pdf', 'F');

echo json_encode([ 'filename'=>$filename ]);
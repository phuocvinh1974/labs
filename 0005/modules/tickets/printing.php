<?php

require_once '../../vendor/tcpdf_min/tcpdf.php';

$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, [50,50], true, 'UTF-8', false);

$post = $_POST['post'];

var_dump($post);

// add first page ---
$pdf->AddPage();
$pdf->Cell(0, 12, 'Ticket 1', 1, 1, 'C');
$pdf->AddPage();
$pdf->Cell(0, 12, 'Ticket 2', 1, 1, 'C');
$pdf->AddPage();
$pdf->Cell(0, 12, 'Ticket 3', 1, 1, 'C');
$pdf->AddPage();
$pdf->Cell(0, 12, 'Ticket 4', 1, 1, 'C');

$pdf->Output ( __DIR__ . '/../../tmp/i.pdf', 'F');
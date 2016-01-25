<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" />

<xsl:template match="discentes">
<html lang="en">
<head>
	<meta charset="UTF-8" />
    <style>
        table{
            position: relative;
            border-collapse: collapse;
            left: 50%;
            transform: translateX(-50%);
            font-family: sans-serif;
        }
        table td, table th{
            border: 1px solid #888;
            border-collapse: collapse;
            padding: .5em;
        }
        table thead {
            background-color: #AAA;
            text-align: center;
        }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th colspan="7">Discentes</th>
            </tr>
            <tr>
                <th>RA</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Situação</th>
                <th>Curso</th>
                <th>Data de matrícula</th>
                <th>Tipo de Ingresso</th>
            </tr>
        </thead>
        <tbody>
            <xsl:for-each select="aluno">
                <tr>
                    <td>
                        <xsl:apply-templates select="ra"></xsl:apply-templates>
                    </td>
                    <td>
                        <xsl:apply-templates select="nome"></xsl:apply-templates>
                    </td>
                    <td>
                        <xsl:apply-templates select="email"></xsl:apply-templates>
                    </td>
                    <td>
                        <xsl:apply-templates select="situacao"></xsl:apply-templates>
                    </td>
                    <td>
                        <xsl:apply-templates select="curso"></xsl:apply-templates>
                    </td>
                    <td>
                        <xsl:apply-templates select="data-matricula"></xsl:apply-templates>
                    </td>
                    <td>
                        <xsl:apply-templates select="tipo-ingresso"></xsl:apply-templates>
                    </td>
                </tr>
            </xsl:for-each>    
        </tbody>
    </table>
</body>
</html>	
</xsl:template>
</xsl:stylesheet> 

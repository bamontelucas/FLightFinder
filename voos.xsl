<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:decimal-format name="euro" decimal-separator="," grouping-separator="."/>
<xsl:output method="html" />

<xsl:template match="resultado">
<html lang="en">
<head>
	<link href="css/bootstrap.css" rel="stylesheet"/>
</head>
<body>
	<div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
        <div class="page-header">
            <h1 class="text-center">
                <div class="row">
                    <div class="col-xs-5">
                        <xsl:apply-templates select="pesquisa/origem/name1"/><br/>
                        <small class="text-muted"><xsl:value-of disable-output-escaping="yes" select="pesquisa/origem/name2"/></small>
                    </div>
                    <div class="col-xs-2">✈</div>
                    <div class="col-xs-5">
                        <xsl:apply-templates select="pesquisa/destino/name1"/><br/>
                        <small class="text-muted"><xsl:value-of disable-output-escaping="yes" select="pesquisa/destino/name2"/></small>
                    </div>
                </div>
            </h1>
        </div>
		<xsl:for-each select="escala">		
            <xsl:sort select="sum(.//voo/preco)" order="ascending"></xsl:sort>
            <xsl:sort select="@escalas" order="ascending"></xsl:sort>	
			<!--<div class="panel panel-primary">-->
			<div>
                <xsl:attribute name="class">
                    <xsl:choose>
                        <xsl:when test="@companhia='azul'">
                            <xsl:text>panel panel-primary</xsl:text>
                        </xsl:when>
                        <xsl:when test="@companhia='gol'">
                            <xsl:text>panel panel-warning</xsl:text>
                        </xsl:when>
                        <xsl:when test="@companhia='tam'">
                            <xsl:text>panel panel-danger</xsl:text>
                        </xsl:when>
                    </xsl:choose>
                </xsl:attribute>
				<div class="panel-heading">
					<h3 class="panel-title" style="text-transform: uppercase;">
                        <img>
                            <xsl:attribute name="src">
                                <xsl:choose>
                                    <xsl:when test="@companhia='azul'">
                                        <xsl:text>img/azul.png</xsl:text>
                                    </xsl:when>
                                    <xsl:when test="@companhia='gol'">
                                        <xsl:text>img/gol.png</xsl:text>
                                    </xsl:when>
                                    <xsl:when test="@companhia='tam'">
                                        <xsl:text>img/tam.png</xsl:text>
                                    </xsl:when>
                                </xsl:choose>
                            </xsl:attribute>
                        </img>&#160;
                        <xsl:apply-templates select="@companhia"/>
                    </h3>
				</div>
				<div class="panel-body">
					<div class="row">
						<div class="col-xs-9">
							<span style="font-size: 20pt; text-align: center;">
								<div class="col-xs-6">
									<xsl:apply-templates select="@origem"/><br/>
                                    <span style="font-size: 0.5em;">
                                        <xsl:apply-templates select="@aeroportoorigem"/><br/>
                                        <small class="text-muted">(<xsl:apply-templates select="@cidadeorigem"/>)</small><br/>
                                        <xsl:apply-templates select=".//voo[1]/datasaida"/>&#160;
								        <xsl:apply-templates select=".//voo[1]/horasaida"/>
                                    </span>
								</div>							
								<div class="col-xs-6">
									<xsl:apply-templates select="@destino"/><br/>
                                    <span style="font-size: 0.5em;">
                                        <xsl:apply-templates select="@aeroportodestino"/><br/>
                                        <small class="text-muted">(<xsl:apply-templates select="@cidadedestino"/>)</small><br/>
                                        <xsl:apply-templates select=".//datachegada[../../@escalas+1]"/>&#160;
								        <xsl:apply-templates select=".//horachegada[../../@escalas+1]"/>
                                    </span>
								</div>
							</span>
						</div>
						<div class="col-xs-3">
							<div class="panel panel-default">
								<div class="panel-body text-right">
									<span class="text-success" style="font-size: 1.5em">R$ <xsl:value-of select="format-number(sum(.//voo/preco), '#,00', 'euro')"/></span><br/>
									<span class="text-danger" style="font-size: 0.8em">Taxas e encargos: R$ <xsl:value-of select="format-number(@taxas, '#,00', 'euro')"/></span>
								</div>
								<div class="panel-footer text-danger">
                                <xsl:for-each select=".//voo/passagens">
                                    <xsl:sort data-type="number" order="ascending"></xsl:sort>
                                    <xsl:if test="position()=1">
                                        <xsl:value-of select="."></xsl:value-of>
                                    </xsl:if>
                                </xsl:for-each>
                                 assentos restantes</div>
							</div>
						</div>					
					</div>	
                    <table class="table table-striped table-condensed text-center" style="font-size: 0.9em;">
                        <thead>
                            <tr>
                                <th class="text-center">Origem</th>
                                <th class="text-center">Destino</th>
                                <th class="text-center">Saída</th>
                                <th class="text-center">Chegada</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="voo">
                                <tr>
                                    <td>
                                        <xsl:value-of select="aeroportoorigem"></xsl:value-of><br/>
                                        <small><xsl:value-of select="cidadeorigem"></xsl:value-of></small>
                                    </td>
                                    <td>
                                        <xsl:value-of select="aeroportodestino"></xsl:value-of><br/>
                                        <small><xsl:value-of select="cidadedestino"></xsl:value-of></small>
                                    </td>
                                    <td>
                                        <xsl:value-of select="datasaida"></xsl:value-of>&#160;
                                        <xsl:value-of select="horasaida"></xsl:value-of>
                                    </td>
                                    <td>
                                        <xsl:value-of select="datachegada"></xsl:value-of>&#160;
                                        <xsl:value-of select="horachegada"></xsl:value-of>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>				
				</div>
			</div>						
		</xsl:for-each>  
	</div>	
</body>
</html>	
</xsl:template>
</xsl:stylesheet> 

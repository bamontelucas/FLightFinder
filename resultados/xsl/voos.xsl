<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" />

<xsl:template match="voos">
<html lang="en">
<head>
	<link href="css/bootstrap.css" rel="stylesheet"/>
	<style>
		div{
		/*	box-shadow: inset 0 0 0 1px black;*/
		}
	</style>
</head>
<body>
	<div class="col-xs-8 col-xs-offset-2">
        <div class="page-header">
            <h1 class="text-center">
                <xsl:apply-templates select="pesquisa/origem"></xsl:apply-templates> 
				✈
				<xsl:apply-templates select="pesquisa/destino"></xsl:apply-templates>
            </h1>
        </div>
		<!--<div class="row">
			<div class="col-xs-12 bg-primary">
				 <xsl:apply-templates select="pesquisa/origem"></xsl:apply-templates> 
				 ✈
				 <xsl:apply-templates select="pesquisa/destino"></xsl:apply-templates>
			</div>
		</div>-->
		<xsl:for-each select="voo">			
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h3 class="panel-title" style="text-transform: uppercase;">
						<xsl:apply-templates select="operadora"></xsl:apply-templates></h3>
				</div>
				<div class="panel-body">
					<div class="row">
						<div class="col-xs-9">
							<span style="font-size: 20pt;">
								<div class="col-xs-6">
									<xsl:apply-templates select="origem"></xsl:apply-templates>
								</div>							
								<div class="col-xs-6">
									<xsl:apply-templates select="destino"></xsl:apply-templates>
								</div>
							</span>
							<div class="col-xs-6">
								<xsl:apply-templates select="datasaida"></xsl:apply-templates>&#160;
								<xsl:apply-templates select="horasaida"></xsl:apply-templates>
							</div>
							<div class="col-xs-6">
								<xsl:apply-templates select="datachegada"></xsl:apply-templates>&#160;
								<xsl:apply-templates select="horachegada"></xsl:apply-templates>
							</div>
						</div>
						<div class="col-xs-3">
							<div class="panel panel-default">
								<div class="panel-body">
									Total: <xsl:apply-templates select="preco"></xsl:apply-templates>
								</div>
								<div class="panel-footer text-danger"><xsl:apply-templates select="passagens"></xsl:apply-templates> assentos restantes</div>
							</div>
						</div>					
					</div>					
				</div>
			</div>						
		</xsl:for-each>  
	</div>	
</body>
</html>	
</xsl:template>
</xsl:stylesheet> 

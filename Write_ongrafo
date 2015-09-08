<?php
require '/vendor/autoload.php';
//require_once "EasyRdfUtils.php";
require_once "HttpClient.php";
EasyRdf_Namespace::set('prism', 'http://prismstandard.org/namespaces/basic/2.0/');  
EasyRdf_Namespace::set('schema', 'http://schema.org/'); 
EasyRdf_Namespace::set('oa', 'http://www.w3.org/ns/oa#');  
EasyRdf_Namespace::set('xsd', 'http://www.w3.org/2001/XMLSchema#');
EasyRdf_Namespace::set('dlib', 'http://www.dlib.org/dlib/november14/');
EasyRdf_Namespace::set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
EasyRdf_Namespace::set('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
EasyRdf_Namespace::set('foaf', 'http://xmlns.com/foaf/0.1/');
EasyRdf_Namespace::set('rsch', 'http://vitali.web.cs.unibo.it/raschietto/');
EasyRdf_Namespace::set('dcterms', 'http://purl.org/dc/terms/');
EasyRdf_Namespace::set('sem', 'http://www.ontologydesignpatterns.org/cp/owl/semiotics.owl#');
EasyRdf_Namespace::set('xs', 'http://www.w3.org/2001/XMLSchema#');
EasyRdf_Namespace::set('dc', 'http://purl.org/dc/elements/1.1/');
	
		
$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1540&pass=jMLP£23a');
//$sparql = new EasyRdf_Sparql_Client(' http://ltw1540:jMLP£23a@tweb2015.cs.unibo.it:8080/data/update/');
//$sparql = new EasyRdf_Sparql_Client('http://localhost:3030/ds/update');



$result=$sparql->update('
									
	INSERT DATA
	{ GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540> { <http://lib/lib1> a <http://libro/libro> } }			
						');	
					
					
//print $result;
//	print $prova

?>

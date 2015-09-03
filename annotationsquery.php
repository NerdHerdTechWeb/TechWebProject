<?php

require_once 'vendor/autoload.php';

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


$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/query');

// Lista di tutti i grafi per uno sepcifico endpoint
#print_r($sparql->listNamedGraphs());


// La query così non da errore
// Forse UNION spacca ??
$result = $sparql->query('
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX oa: <http://www.w3.org/ns/oa#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rsch: <http://vitali.web.cs.unibo.it/raschietto/>
SELECT ?watf ?author ?author_fullname ?author_email ?date ?label ?body ?s ?p ?o ?body_l ?o_label ?start ?startoffset ?endoffset
WHERE{
	GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1525>
	{
		?annotation  rdf:type oa:Annotation ;
			oa:annotatedAt ?date ;
			oa:annotatedBy ?author .
		OPTIONAL { ?author foaf:name ?author_fullname }
		OPTIONAL { ?author schema:email ?author_email}
		OPTIONAL { ?annotation rdfs:label ?label }
		OPTIONAL { ?annotation rsch:type ?watf }       
		OPTIONAL { ?annotation oa:hasBody ?body }
		OPTIONAL { ?body rdf:subject ?s }
		OPTIONAL { ?body rdf:predicate ?p }
		OPTIONAL { ?body rdf:object ?o }
		OPTIONAL { ?body rdfs:label ?body_l }
		OPTIONAL { ?o    rdfs:label ?o_label}
		?annotation oa:hasTarget ?node.
		?node rdf:type oa:SpecificResource ;
		    oa:hasSource ?source ;
		    oa:hasSelector ?selector.
		?selector rdf:type oa:FragmentSelector ;
			rdf:value ?start ;
			oa:start ?startoffset ;
			oa:end ?endoffset
	}         
}');

// Tramite var_dump possiamo capire che oggetto è restuituito
// IN questo caso è di tipo EasyRdf_Sparql_Result perché la risposta è in json
// EasyRdf trasfomra il json in oggetto
// Ho notato che non siamo in grado di risalire al json
var_dump($result->dump());
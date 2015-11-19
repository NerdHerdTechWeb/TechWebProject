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
EasyRdf_Namespace::set('fabio', 'http://purl.org/spar/fabio/');
EasyRdf_Namespace::set('frbr', 'http://purl.org/vocab/frbr/core#');

EasyRdf_Namespace::set('skos', 'http://www.w3.org/2004/02/skos/core#');
EasyRdf_Namespace::set('sro', 'http://salt.semanticauthoring.org/ontologies/sro#');
EasyRdf_Namespace::set('deo', 'http://purl.org/spar/deo/');
EasyRdf_Namespace::set('cito', 'http://purl.org/spar/cito/');

//$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1540&pass=jMLP£23a');
//$sparql = new EasyRdf_Sparql_Client(' http://ltw1540:jMLP£23a@tweb2015.cs.unibo.it:8080/data/update/');
$sparql = new EasyRdf_Sparql_Client('http://localhost:3030/ds/update');


$predicates = array("hasAuthor" => EasyRdf_Namespace::expand('dcterms:creator'),
    "hasPublicationYear" => EasyRdf_Namespace::expand('fabio:hasPublicationYear'),
    "hasTitle" => EasyRdf_Namespace::expand('dcterms:title'),
    "hasDOI" => EasyRdf_Namespace::expand('prism:doi'),
    "hasURL" => EasyRdf_Namespace::expand('fabio:hasURL'),
    "hasComment" => EasyRdf_Namespace::expand('schema:comment'),
    "denotesRhetoric" => EasyRdf_Namespace::expand('sem:denotes'),
    "references" => EasyRdf_Namespace::expand('cito:cites'),
);

$retorica = array("Abstract" => EasyRdf_Namespace::expand('sro:Abstract'),
    "Introduction" => EasyRdf_Namespace::expand('deo:Introduction'),
    "Materials" => EasyRdf_Namespace::expand('deo:Materials'),
    "Methods" => EasyRdf_Namespace::expand('deo:Methods'),
    "Results" => EasyRdf_Namespace::expand('deo:Results'),
    "Discussion" => EasyRdf_Namespace::expand('sro:Discussion'),
    "Conclusion" => EasyRdf_Namespace::expand('sro:Conclusion'),
);


$annotation = array(
    "type" => "references",
    "label" => "author",
    "body" => array(
        "label" => "D. J. DONNELL (1982). Additive principal components - a method for estimating equations with small variance from data. Ph.D. thesis, University ofWashington, Seattle.",
        "subject" => null,
        "predicate" => null,
        "object" => null,
        "o_id" => null,
        "o_label" => null,
    ),
    "target" => array(
        "source" => "http://www.dlib.org/dlib/march15/sorensen/03sorensen.html",
        "id" => "table[2]/tr/td[2]/p",
        "end" => 11,
        "start" => 0,
    ),
    "provenance" => array(
        "author" => array(
            "id" => null,
            "name" => "Pazzo",
            "email" => "fabiovitali@unibo.it",
        ),
        "time" => "2015-10-1",
    ),
);

//PARSING ANNOTAZIONE

//$annotation["target"]["source"]='http://www.dlib.org/dlib/september14/jettka/09jettka';
//$item= 'http://www.dlib.org/dlib/september14/jettka/09jettka.html';//DEVE ESSERE PASSATO si può prendere dalla source 

$item = $annotation["target"]["source"];
$work = str_replace('.html', '', $item);
$expression = str_replace('.html', '', $item);
$expression = $expression . "_ver1";

$annotation["provenance"]["author"]['id'] = "mailto:" . $annotation["provenance"]["author"]["email"];

/*
echo $item;
echo $work;
echo $expression ;
echo "SONO QUI!"; exit;	*/


$graph1 = new EasyRdf_Graph();


//EXPRESSION WORK ITEM

$graph1->addResource($work, 'rdf:type', EasyRdf_Namespace::expand('fabio:Work'));
$graph1->addResource($work, EasyRdf_Namespace::expand('fabio:hasPortrayal'), $item);
$graph1->addResource($work, EasyRdf_Namespace::expand('frbr:realization'), $expression);
$graph1->addResource($expression, 'rdf:type', EasyRdf_Namespace::expand('fabio:Expression'));
$graph1->addResource($expression, EasyRdf_Namespace::expand('fabio:hasRepresantation'), $item);
$graph1->addResource($item, 'rdf:type', EasyRdf_Namespace::expand('fabio:item'));


// ANNOTAZIONE

$anno = $graph1->newBnode();
$graph1->addResource($anno, 'rdf:type', EasyRdf_Namespace::expand('oa:Annotation'));
$graph1->add($anno, EasyRdf_Namespace::expand('rdfs:label'), EasyRdf_Literal::create($annotation["label"], null, 'xs:string'));
$graph1->add($anno, EasyRdf_Namespace::expand('rsch:type'), EasyRdf_Literal::create($annotation["type"], null, 'xs:normalizedString'));
$graph1->add($anno, EasyRdf_Namespace::expand('oa:annotatedAt'), EasyRdf_Literal::create($annotation["provenance"]["time"], null, 'xs:dateTime'));
$auth = $annotation["provenance"]["author"]['id'];
$graph1->addResource($anno, EasyRdf_Namespace::expand('oa:annotatedBy'), $auth);


//TARGET
$target = $graph1->newBNodeId();
$sel = $graph1->newBNodeId();
$graph1->addResource($anno, EasyRdf_Namespace::expand('oa:hasTarget'), $target);
$graph1->addResource($target, EasyRdf_Namespace::expand('rdf:type'), EasyRdf_Namespace::expand('oa:SpecificResource'));
$graph1->addResource($target, EasyRdf_Namespace::expand('oa:hasSelector'), $sel);
$graph1->addResource($sel, EasyRdf_Namespace::expand('rdf:type'), EasyRdf_Namespace::expand('oa:FragmentSelector'));
$graph1->add($sel, EasyRdf_Namespace::expand('rdf:value'), EasyRdf_Literal::create($annotation["target"]["id"], null, 'xs:normalizedString'));


$graph1->addLiteral($sel, EasyRdf_Namespace::expand('oa:end'), $annotation["target"]["end"]);
$graph1->addLiteral($sel, EasyRdf_Namespace::expand('oa:start'), $annotation["target"]["start"]);
$graph1->addResource($target, EasyRdf_Namespace::expand('oa:hasSource'), $annotation["target"]["source"]);

//NOME

$graph1->add($auth, EasyRdf_Namespace::expand('foaf:name'), EasyRdf_Literal::create($annotation["provenance"]["author"]["name"], null, 'xs:string'));
$graph1->add($auth, EasyRdf_Namespace::expand('schema:email'), EasyRdf_Literal::create($annotation["provenance"]["author"]["email"], null, 'xs:normalizedString'));

// $result = $sparql->insert($graph2, 'http://vitali.web.cs.unibo.it/raschietto/graph/ltwbod');

//BODY
$statement = $graph1->newBNodeId();


//$statement = EasyRdf_Namespace::expand('rdf:Statement');


//$label = $annotation["body"]["label"]; --->ELIMINATO DA QUI

$p = $predicates[$annotation["type"]];


if ($annotation["type"] == "hasAuthor") { /// QUI DIOBONO

    $s = $work;
    $o = $graph1->newBNode();

    $graph1->addResource($o, EasyRdf_Namespace::expand('rdf:type'), EasyRdf_Namespace::expand('foaf:Person'));

    //      $annotation["body"]["o_label"]= $annotation["body"]["object"];
	//		$annotation["body"]["label"]= $annotation["body"]["object"]." è un autore del documento";

   //    $autore = trim($annotation["body"]["o_label"]); da trasformare in ['object']

    $firstname = preg_replace('/\W.*/', '', $autore);
    $name = str_replace($firstname, $autore[0], $autore);
    $name = preg_replace("/ /", "-", $name, 1);
    $name = str_replace(" ", "", $name);

    $annotation["body"]["o_id"] = EasyRdf_Namespace::expand('rsch:person') . "/" . strtolower($name);
    $graph1->addResource($o, EasyRdf_Namespace::expand('rdf:subject'), $annotation["body"]["o_id"]);

    $graph1->add($o, EasyRdf_Namespace::expand('rdfs:label'), EasyRdf_Literal::create($annotation["body"]["o_label"], null, 'xsd:string'));


}

if ($annotation["type"] == "hasPublicationYear") {

    $s = $expression;
//    $annotation["body"]["label"]= "La data di pubblicazione è ".$annotation["body"]["object"];
    $o = EasyRdf_Literal::create($annotation["body"]["object"], null, 'xsd:date');
}

if ($annotation["type"] == "hasTitle" || $annotation["type"] == "hasDOI") {

    $s = $expression;
 //  $annotation["body"]["label"]= "Titolo o doi dell'documento:  ".$annotation["body"]["object"];
    $o = EasyRdf_Literal::create($annotation["body"]["object"], null, 'xsd:string');
}
if ($annotation["type"] == "hasURL") {

    $s = $expression;
 //   $annotation["body"]["label"]= "Un URL del documento è ".$annotation["body"]["object"];
    $o = EasyRdf_Literal::create($annotation["body"]["object"], null, 'xsd:anyURL');

}

if ($annotation["type"] == "hasComment") {

    $o = EasyRdf_Literal::create($annotation["body"]["object"], null, 'xsd:string');

    $temp = str_replace("/", "_", $annotation["target"]["id"]);
    $temp = str_replace("[", "", $temp);
    $temp = str_replace("]", "", $temp);

 //  $annotation["body"]["label"]= "Un Commento: ".$annotation["body"]["object"];
    $s = $annotation["target"]["source"] . "#" . $temp . "-" . $annotation["target"]["start"] . "-" . $annotation["target"]["end"] . "_ver1";


}

if ($annotation["type"] == "denotesRhetoric") {


    $temp = str_replace("/", "_", $annotation["target"]["id"]);
    $temp = str_replace("[", "", $temp);
    $temp = str_replace("]", "", $temp);
    $s = $annotation["target"]["source"] . "#" . $temp . "-" . $annotation["target"]["start"] . "-" . $annotation["target"]["end"] . "_ver1";

    $o = $graph1->newBNode();

  //  $annotation["body"]["o_label"] = $annotation["body"]["object"];
//    $annotation["body"]["label"]= "Il frammento denota: ".$annotation["body"]["object"];   
   
   
    $graph1->addResource($o, EasyRdf_Namespace::expand('rdf:type'), EasyRdf_Namespace::expand('skos:Concept'));
    $graph1->add($o, EasyRdf_Namespace::expand('rdfs:label'), EasyRdf_Literal::create($annotation["body"]["o_label"], null, 'xsd:string'));
 //   $annotation["body"]["o_id"] = $retorica[$annotation["body"]["o_label"]]; ->da trasformare in ['object']
    $graph1->addResource($o, EasyRdf_Namespace::expand('rdf:subject'), $annotation["body"]["o_id"]);

}

if ($annotation["type"] == "references") {

    $s = $expression;
// $annotation["body"]["label"]= "Un riferimento del documento è: ".$annotation["body"]["object"];
    $o = $work . "_" . "cited" . "_" . urlencode($annotation["body"]["label"]) . "ver_1";
    //$graph1->add($o,EasyRdf_Namespace::expand('rdfs:label'),EasyRdf_Literal::create($annotation["body"]["label"],null,'xsd:string'));


}
// $label = $annotation["body"]["label"]; aggiunta qui
$graph1->addResource($anno, EasyRdf_Namespace::expand('oa:hasBody'), $statement);
$graph1->addResource($statement, 'rdf:type', EasyRdf_Namespace::expand('rdf:Statement'));
$graph1->addResource($statement, EasyRdf_Namespace::expand('rdf:subject'), $s);
$graph1->addResource($statement, EasyRdf_Namespace::expand('rdf:spredicate'), $p);
//if ($annotation["type"] != "references") RIMOSSO
 //   $graph1->add($statement, EasyRdf_Namespace::expand('rdf:object'), $o);RIMOSSO
//else RIMOSSO
    $graph1->addResource($statement, EasyRdf_Namespace::expand('rdf:object'), $o);
$graph1->add($statement, EasyRdf_Namespace::expand('rdfs:label'), EasyRdf_Literal::create($label, null, 'xs:String'));


$result = $sparql->insert($graph1, 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540');

print_r($result);

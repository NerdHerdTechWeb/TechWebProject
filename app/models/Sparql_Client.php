<?php

/**
 * Created by PhpStorm.
 * User: masettir
 * Date: 04/09/2015
 * Time: 12.27
 */
class Sparql_Client
{
    protected $sparql_client = 'http://tweb2015.cs.unibo.it:8080/data/query';
    protected $sClient;

    public $results = false;

    /**
     * Set name space
     */
    public function __construct()
    {
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


        $this->sClient = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/query');
    }

    /**
     * Get all annotation from single document
     * @param string $documentUri
     * @param array $queryParams
     * @return $this
     */
    public function getAnnotationsByDocument($documentUri = '', $queryParams = array())
    {
        $defaultUri = 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1525';

        $query = "
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX oa: <http://www.w3.org/ns/oa#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rsch: <http://vitali.web.cs.unibo.it/raschietto/>
SELECT ?watf ?author ?author_fullname ?author_email ?date ?label ?body ?s ?p ?o ?body_l ?o_label ?start ?startoffset ?endoffset
WHERE{
	GRAPH <{$defaultUri}>
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
}";
        $this->results = $this->sClient->query($query);

        return $this;
    }

    /**
     *
     */
    public function updateDocumentAnnotation()
    {

    }

    /**
     *
     */
    public function addDocumentAnnotation()
    {

    }

    /**
     * Return the previews query in json representation
     * @return string | json
     */
    public function getAnnotationsJson()
    {
        header('Content-type: application/json');
        $rows = array();
        $i = 0;
        foreach ($this->results as $row => $val) {
            foreach($val as $k => $v){
                $rows[$i][$k] = (string)$v;
            }
            $i++;
        }

        return json_encode($rows);
    }

    /**
     * Return the previews query in json representation
     * @return array
     */
    public function getAnnotationsArray()
    {
        $rows = array();
        $i = 0;
        foreach ($this->results as $row => $val) {
            foreach($val as $k => $v){
                $rows[$i][$k] = (string)$v;
            }
            $i++;
        }

        return $rows;
    }

    /**
     * Get all graph from endpoint
     * @return array
     */
    public function getGraphList()
    {
        // Lista di tutti i grafi per uno sepcifico endpoint
        return $this->sClient->listNamedGraphs();
    }

    /**
     * Dump html
     * @return mixed
     */
    public function dumpHtml()
    {
        return $this->results->dump();
    }
}
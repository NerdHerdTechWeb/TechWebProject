<?php

/**
 * 
 * Easy Rdf Wrapper
 * 
 * Updates documents
 * Gets documents List
 * Gets annotations per document
 * Creates document
 * 
 */
class Sparql_Client
{
    protected $sparql_client = 'http://tweb2015.cs.unibo.it:8080/data/query';
    protected $sparql_client_modify = 'http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1540&pass=Xab7!=UUj';
    protected $sClient;
    protected $sClientModify;

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
        EasyRdf_Namespace::set('xs', 'http://www.w3.org/2001/XMLSchema#');
        EasyRdf_Namespace::set('dc', 'http://purl.org/dc/elements/1.1/');
        EasyRdf_Namespace::set('fabio','http://purl.org/spar/fabio/');
        EasyRdf_Namespace::set('frbr','http://purl.org/vocab/frbr/core#');
        EasyRdf_Namespace::set('skos','http://www.w3.org/2004/02/skos/core#');
        EasyRdf_Namespace::set('sro','http://salt.semanticauthoring.org/ontologies/sro#');
        EasyRdf_Namespace::set ('deo','http://purl.org/spar/deo/');	
        EasyRdf_Namespace::set('cito','http://purl.org/spar/cito/');
        
        $this->sClient = new EasyRdf_Sparql_Client($this->sparql_client);
        $this->sClientModify = new EasyRdf_Sparql_Client($this->sparql_client_modify);
    }

    /**
     * Get all annotation from single document
     * @param array $queryParams
     * @internal param string $documentUri
     * @return $this
     */
    public function getAnnotationsByDocument($queryParams = array())
    {
        $defaults = array(
            'graph' => 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540',
            'source' => '',
            'author_fullname' => '',
            'author_email' => ''
        );

        $defaults = array_merge($defaults, $queryParams);

        $query = "
SELECT ?wtf ?author ?author_fullname ?author_email ?date ?label ?body ?s ?p ?o ?body_l ?o_label ?start ?startoffset ?endoffset
WHERE{
	GRAPH <{$defaults['graph']}>
	{
		?annotation  rdf:type oa:Annotation ;
			oa:annotatedAt ?date ;
			oa:annotatedBy ?author .
		OPTIONAL { ?author foaf:name ?author_fullname }
		OPTIONAL { ?author schema:email ?author_email }
		OPTIONAL { ?annotation rdfs:label ?label }
		OPTIONAL { ?annotation rsch:type ?wtf }
		OPTIONAL { ?annotation oa:hasBody ?body }
		OPTIONAL { ?body rdf:subject ?s }
		OPTIONAL { ?body rdf:predicate ?p }
		OPTIONAL { ?body rdf:object ?o }
		OPTIONAL { ?body rdfs:label ?body_l }
		OPTIONAL { ?o    rdfs:label ?o_label}
		?annotation oa:hasTarget ?node.
		?node rdf:type oa:SpecificResource ;
		    oa:hasSource <{$defaults['source']}> ;
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
     * @param $queryParams array
     * @return string
     */
    public function updateDocumentAnnotation($queryParams)
    {
        $annotation = new Sparql_Edit();
        $graph = $annotation->buildAnnotation($queryParams)->getGraph();
        $results = $this->sClientModify->insert($graph, 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540');
        return json_encode(array('message' => $results->getMessage(), 'status' => $results->getStatus()));
    }

    /**
     *
     */
    public function addDocumentAnnotation($queryParams)
    {
        $annotation = new Sparql_Edit();
        $graph = $annotation->buildAnnotation($queryParams)->getGraph();
        $results = $this->sClientModify->insert($graph, 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540');
        return json_encode(array('message' => $results));
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
                
                if(strcasecmp('label',$k) == 0){
                    if(strcasecmp($v,'Author') == 0 || strcasecmp($v,'Autore') == 0)
                        $val->wtf = 'hasAuthor';
                    if(strcasecmp($v,'Title') == 0 || strcasecmp($v,'Titolo') == 0)
                        $val->wtf = 'hasTitle';
                    if(strcasecmp($v,'PublicationYear') == 0 || strcasecmp($v,'AnnoPubblicazione') == 0)
                        $val->wtf = 'hasPublicationYear';
                    if(strcasecmp($v,'DOI') == 0)
                        $val->wtf = 'hasDOI';
                    if(strcasecmp($v,'Citation') == 0 || strcasecmp($v,'Citazione') == 0)
                        $val->wtf = 'references';
                    if(strcasecmp($v,'Comment') == 0 || strcasecmp($v,'Commento') == 0)
                        $val->wtf = 'hasComment';
                    if(strcasecmp($v,'Rhetoric') == 0 || strcasecmp($v,'Retorica') == 0)
                        $val->wtf = 'denotesRhetoric';
                }

                if(strcasecmp('start',$k) == 0){
                    $newText = preg_replace('(tbody1_)','',$v);
                    $pm = preg_match('/\[\d\]/',$newText);
                    $areSquareBrackets = empty($pm);
                    if($areSquareBrackets)
                        $newText = preg_replace('[\d]','[$0]',$newText);
                    $xpath = preg_replace('(_)','/',$newText);
                    $v = $xpath;
                    $isBody = preg_match('(body)',$xpath);
                    if($isBody === 0)
                        $v = '/html/body/'.$v;
                }
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
     * 
     * Search documents by filters
     * Fill left sidebar
     * Return a list of documents
     * 
     */
    public function documentSearch($params = array())
    {
        $author = !empty($params['author']) ? $params['author'] : 'false';
        $url = !empty($params['url']) ? $params['url'] : 'false';
        $title = !empty($params['title']) ? $params['title'] : 'false';
        $cities = !empty($params['cities']) ? $params['cities'] : 'false';
        $date = !empty($params['date']) ? $params['date'] : 'false';
        
        $query = "
SELECT ?source
WHERE{
	GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540>
	{
	
	    ?annotation  rdf:type oa:Annotation.
        OPTIONAL { ?annotation rsch:type ?wtf }
        OPTIONAL { ?annotation oa:hasBody ?body }
        OPTIONAL { ?body rdf:subject ?s }
        OPTIONAL { ?body rdf:predicate ?p }
        OPTIONAL { ?body rdf:object ?o }
        OPTIONAL { ?body rdfs:label ?body_l }
        OPTIONAL { ?o    rdfs:label ?o_label}
        ?annotation oa:hasTarget ?node.
        ?node rdf:type oa:SpecificResource ;
              oa:hasSource ?source .
  	
        { FILTER ((?wtf = 'hasPublicationYear' && str(?o) >= '$date')  ||
	        (?wtf = 'hasAuthor' && regex(?o_label , '$author')) ||
	        (?wtf ='hasURL' && regex (str(?o) , LCASE('$url'))) ||
	        (?wtf ='hasTitle' && regex (LCASE(str(?o)) ,LCASE('$title'))) ||
	        (?wtf ='references' && regex (str(?o) , LCASE('$cities'))))
	    }
	}
}
LIMIT 100";

        $this->results = $this->sClient->query($query);
        return $this;
    }
    
    /**
     * 
     * Returns documents list as json
     * Returns json object instead that an array of json objects
     * 
     */
    public function getSearchJson(){
        $rows = array();
        $i = 0;
        foreach ($this->results as $row => $val) {
            foreach($val as $k => $v){
                $rows[] = (string)$v;
            }
            $i++;
        }
        if(count($rows) <= 1)
            $res = array(!empty($rows) ? $rows[0] : false);
        else 
            $res = array_unique($rows);

        //TODO check uri domain (dLib, rStat, anything else)
        $leftMenuObject = Data_Scraping::dLibScrapingUrlCollection(array_unique($res));

        return $leftMenuObject;
    }

    /**
     * Get all graph from endpoint
     * @return array
     */
    public function getGraphList()
    {
        // Lista di tutti i grafi per uno sepcifico endpoint
        $this->results = $this->sClient->listNamedGraphs();
        return $this;
    }
    
     /**
     * Get all graph from endpoint
     * @return array
     */
    public function getGraphListJson()
    {
        $collection = array();
        // Lista di tutti i grafi per uno sepcifico endpoint
        foreach ($this->results as $key => $value) {
            $collection[] = $value->getUri();
        }
        return json_encode($collection);
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

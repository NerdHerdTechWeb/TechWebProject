<?php

/**
 * Class Sparql_Edit
 * Sparql client helper
 * Separation of concepts
 */
class Sparql_Edit
{

    protected $citparams;
    protected $predicates;
    protected $labels;
    protected $retorica;
    protected $annotation;
    protected $graph1;
    ;

    public function __construct()
    {
        
       $this->citparams = array("Author"=>null,
		  	        "PublicationYear"=>null,
			        "Title"=>null,
			        "DOI"=>null,
			        "URL"=>null,
			       );
        
        
        
        $this->labels = array("hasAuthor" => "Author",
			      "hasPublicationYear" => "Publication Year",
			      "hasTitle" => "Title",
			      "hasDOI" => "DOI",			  
			      "hasURL" => "URL",
			      "hasComment" => "Comment",
			      "denotesRhetoric" => "Rethoric",
			      "references" => "Citation",
			   );
        
        $this->predicates = array("hasAuthor" => EasyRdf_Namespace::expand('dcterms:creator'),
            "hasPublicationYear" => EasyRdf_Namespace::expand('fabio:hasPublicationYear'),
            "hasTitle" => EasyRdf_Namespace::expand('dcterms:title'),
            "hasDOI" => EasyRdf_Namespace::expand('prism:doi'),
            "hasURL" => EasyRdf_Namespace::expand('fabio:hasURL'),
            "hasComment" => EasyRdf_Namespace::expand('schema:comment'),
            "denotesRhetoric" => EasyRdf_Namespace::expand('sem:denotes'),
            "references" => EasyRdf_Namespace::expand('cito:cites'),
        );

        $this->retorica = array("Abstract" => EasyRdf_Namespace::expand('sro:Abstract'),
            "Introduction" => EasyRdf_Namespace::expand('deo:Introduction'),
            "Materials" => EasyRdf_Namespace::expand('deo:Materials'),
            "Methods" => EasyRdf_Namespace::expand('deo:Methods'),
            "Results" => EasyRdf_Namespace::expand('deo:Results'),
            "Discussion" => EasyRdf_Namespace::expand('sro:Discussion'),
            "Conclusion" => EasyRdf_Namespace::expand('sro:Conclusion'),
        );

        $this->graph1 = new EasyRdf_Graph();
    }

    public function buildAnnotation($queryParams = array())
    {

        $date = DateTime::createFromFormat('U.u', microtime(true));
        

        $this->annotation = array(
            "type" => $queryParams['type'],
            "label" => preg_replace('(has)','',$queryParams['type']),
            "body" => array(
                "label" => $queryParams['fragment'],
                "subject" => null,
                "predicate" => null,
                "object" => $queryParams['fragment'],
                "o_id" => null,
                "o_label" => $queryParams['fragment'],
            ),
            "target" => array(
                "source" => $queryParams['docSource'],
                "id" => $queryParams['xpath'],
                "start" => $queryParams['xpath'],
                "endoffset" => $queryParams['end'],
                "startoffset" => $queryParams['start'],
            ),
            "provenance" => array(
                "author" => array(
                    "id" => null,
                    #"name" => "Fabio",
                    "name" => $queryParams['username'],
                    "email" => $queryParams['email'],
                ),
                "time" => $date->format('Y-m-d\TH:i:s.u'),
            ),
        );

        return $this->prepareAnnotation();
    }

    protected function prepareAnnotation()
    {
        $item = $this->annotation["target"]["source"];
        $work = str_replace('.html', '', $item);
        $expression = $work . "_ver1";

        /**
         * Create id mail and label
         */
        $this->annotation["provenance"]["author"]['id'] = "mailto:" . $this->annotation["provenance"]["author"]["email"];
	    //$this->annotation["label"] = $labels[$this->annotation["type"]];	
	    $this->annotation["label"] = $this->annotation['label'];
        //EXPRESSION WORK ITEM

        $this->graph1->addResource($work, 'rdf:type', EasyRdf_Namespace::expand('fabio:Work'));
        $this->graph1->addResource($work, EasyRdf_Namespace::expand('fabio:hasPortrayal'), $item);
        $this->graph1->addResource($work, EasyRdf_Namespace::expand('frbr:realization'), $expression);
        $this->graph1->addResource($expression, 'rdf:type', EasyRdf_Namespace::expand('fabio:Expression'));
        $this->graph1->addResource($expression, EasyRdf_Namespace::expand('fabio:hasRepresentation'), $item);
        $this->graph1->addResource($item, 'rdf:type', EasyRdf_Namespace::expand('fabio:item'));


        // ANNOTAZIONE
        $anno = $this->graph1->newBnode();
        $this->graph1->addResource($anno, 'rdf:type', EasyRdf_Namespace::expand('oa:Annotation'));
        $this->graph1->add($anno, EasyRdf_Namespace::expand('rdfs:label'), EasyRdf_Literal::create($this->annotation["label"], null, 'xs:string'));
        $this->graph1->add($anno, EasyRdf_Namespace::expand('rsch:type'), EasyRdf_Literal::create($this->annotation["type"], null, 'xs:string'));
        $this->graph1->add($anno, EasyRdf_Namespace::expand('oa:annotatedAt'), EasyRdf_Literal::create($this->annotation["provenance"]["time"], null, 'xs:dateTime'));
        $auth = $this->annotation["provenance"]["author"]['id'];
        $this->graph1->addResource($anno, EasyRdf_Namespace::expand('oa:annotatedBy'), $auth);

        //TARGET
        $target = $this->graph1->newBNodeId();
        $sel = $this->graph1->newBNodeId();
        $this->graph1->addResource($anno, EasyRdf_Namespace::expand('oa:hasTarget'), $target);
        $this->graph1->addResource($target, EasyRdf_Namespace::expand('rdf:type'), EasyRdf_Namespace::expand('oa:SpecificResource'));
        $this->graph1->addResource($target, EasyRdf_Namespace::expand('oa:hasSelector'), $sel);
        $this->graph1->addResource($sel, EasyRdf_Namespace::expand('rdf:type'), EasyRdf_Namespace::expand('oa:FragmentSelector'));
        $this->graph1->add($sel, EasyRdf_Namespace::expand('rdf:value'), EasyRdf_Literal::create($this->annotation["target"]["id"], null, 'xs:string'));
        $this->graph1->add($sel, EasyRdf_Namespace::expand('rdf:value'), EasyRdf_Literal::create($this->annotation["target"]["start"], null, 'xs:string'));

        $this->graph1->addLiteral($sel, EasyRdf_Namespace::expand('oa:end'), $this->annotation["target"]["endoffset"]);
        $this->graph1->addLiteral($sel, EasyRdf_Namespace::expand('oa:start'), $this->annotation["target"]["startoffset"]);
        $this->graph1->addResource($target, EasyRdf_Namespace::expand('oa:hasSource'), $this->annotation["target"]["source"]);

        //NOME
        $this->graph1->add($auth, EasyRdf_Namespace::expand('foaf:name'), EasyRdf_Literal::create($this->annotation["provenance"]["author"]["name"], null, 'xs:string'));
        $this->graph1->add($auth, EasyRdf_Namespace::expand('schema:email'), EasyRdf_Literal::create($this->annotation["provenance"]["author"]["email"], null, 'xs:string'));

        //$result = $sparql->insert($graph2, 'http://vitali.web.cs.unibo.it/raschietto/graph/ltwbod');

        //BODY
        $statement = $this->graph1->newBNodeId();

        $p = $this->predicates[$this->annotation["type"]];


        if ($this->annotation["type"] == "hasAuthor") { /// QUI DIOBONO

            $s = $work;
            $o = $this->graph1->newBNode();

            $this->graph1->addResource($o, EasyRdf_Namespace::expand('rdf:type'), EasyRdf_Namespace::expand('foaf:Person'));

            $this->annotation["body"]["o_label"]= $this->annotation["body"]["object"];
	    $this->annotation["body"]["label"]= $this->annotation["body"]["object"]." è un autore del documento";
            
            $autore = trim($this->annotation["body"]["object"]);

            $firstname = preg_replace('/\W.*/', '', $autore);
            $name = str_replace($firstname, $autore[0], $autore);
            $name = preg_replace("/ /", "-", $name, 1);
            $name = str_replace(" ", "", $name);

            $this->annotation["body"]["o_id"] = EasyRdf_Namespace::expand('rsch:person') . "/" . strtolower($name);
            $this->graph1->addResource($o, EasyRdf_Namespace::expand('rdf:subject'), $this->annotation["body"]["o_id"]);

            $this->graph1->add($o, EasyRdf_Namespace::expand('rdfs:label'), EasyRdf_Literal::create($this->annotation["body"]["o_label"], null, 'xsd:string'));


        }

        if ($this->annotation["type"] == "hasPublicationYear") {

            $s = $expression;
            $this->annotation["body"]["label"]= "La data di pubblicazione è ". $this->annotation["body"]["object"];
            $o = EasyRdf_Literal::create($this->annotation["body"]["object"], null, 'xsd:date');
        }

        if ($this->annotation["type"] == "hasTitle") {

            $s = $expression;
            $this->annotation["body"]["label"]= "Il titolo del documento è " . $this->annotation["body"]["object"];
            $o = EasyRdf_Literal::create($this->annotation["body"]["object"], null, 'xsd:string');
        }
        if ($annotation["type"] == "hasDOI"){
	
	    $s = $expression;
	    $this->annotation["body"]["label"]= "Il DOI del documento è ". $this->annotation["body"]["object"];
	    $o = EasyRdf_Literal::create($this->annotation["body"]["object"],null,'xsd:string');
	}
        if ($this->annotation["type"] == "hasURL") {

            $s = $expression;
            $this->annotation["body"]["label"]= "Un URL del documento è " . $this->annotation["body"]["object"];
            $o = EasyRdf_Literal::create($this->annotation["body"]["object"], null, 'xsd:anyURL');

        }

        if ($this->annotation["type"] == "hasComment") {

            $o = EasyRdf_Literal::create($this->annotation["body"]["object"], null, 'xsd:string');

            $temp = str_replace("/", "_", $this->annotation["target"]["id"]);
            $temp = str_replace("[", "", $temp);
            $temp = str_replace("]", "", $temp);

            $this->annotation["body"]["label"]= "Un Commento: ".$this->annotation["body"]["object"];
            $s = $this->annotation["target"]["source"] . "#" . $temp . "-" . $this->annotation["target"]["startoffset"] . "-" . $this->annotation["target"]["endoffset"] . "_ver1";


        }

        if ($this->annotation["type"] == "denotesRhetoric") {


            $temp = str_replace("/", "_", $this->annotation["target"]["id"]);
            $temp = str_replace("[", "", $temp);
            $temp = str_replace("]", "", $temp);
            $s = $this->annotation["target"]["source"] . "#" . $temp . "-" . $this->annotation["target"]["startoffset"] . "-" . $this->annotation["target"]["endoffset"] . "_ver1";

            $o = $this->graph1->newBNode();
            
            $this->annotation["body"]["o_label"] = $this->annotation["body"]["object"];
            $this->annotation["body"]["label"]= "Il frammento denota: ".$this->annotation["body"]["object"];

            $this->graph1->addResource($o, EasyRdf_Namespace::expand('rdf:type'), EasyRdf_Namespace::expand('skos:Concept'));
            $this->graph1->add($o, EasyRdf_Namespace::expand('rdfs:label'), EasyRdf_Literal::create($this->annotation["body"]["o_label"], null, 'xsd:string'));
            $this->annotation["body"]["o_id"] = $this->retorica[$this->annotation["body"]["object"]];
            $this->graph1->addResource($o, EasyRdf_Namespace::expand('rdf:subject'), $this->annotation["body"]["o_id"]);
        }

        if ($this->annotation["type"] == "references") {

            $s = $expression;
            //$this->annotation["body"]["label"]= "Un riferimento del documento è: " . $this->annotation["body"]["object"];
            $o = $work . "_" . "cited" . "_" . urlencode($this->annotation["body"]["object"]) . "_ver_1";

        }

        $label = $this->annotation["body"]["label"];
        $this->graph1->addResource($anno, EasyRdf_Namespace::expand('oa:hasBody'), $statement);
        $this->graph1->addResource($statement, 'rdf:type', EasyRdf_Namespace::expand('rdf:Statement'));
        $this->graph1->addResource($statement, EasyRdf_Namespace::expand('rdf:subject'), $s);
        $this->graph1->addResource($statement, EasyRdf_Namespace::expand('rdf:predicate'), $p);
        if ($this->annotation["type"] != "references") 
		$this->graph1->add($statement, EasyRdf_Namespace::expand('rdf:object'), $o);
	else 
    	{	
	$this->graph1->addResource($statement, EasyRdf_Namespace::expand('rdf:object'), $o);
	$cito = $o;
	$el = NULL;
	$this->graph1->addResource($cito, 'a',EasyRdf_Namespace::expand('fabio:Expression'));
	$this->graph1->add($cito, EasyRdf_Namespace::expand('rdfs:label'),$annotation["body"]["object"]);
	
		 if (!is_null($citparams['Author'])){
		 		$this->graph1->add($cito, EasyRdf_Namespace::expand('dcterms:creator'),$this->citparams['Author']);
				$el = "Autore:". $this->citparams['Author'];
		 }
		 if (!is_null($citparams['Title'])){
		   		$this->graph1->add($cito, EasyRdf_Namespace::expand('dcterms:title'),$this->citparams['Title']);
    				$el = $el . ", Titolo:". $this->citparams['Title'];
		 }
		 if (!is_null($citparams['PublicationYear'])){
		 		$this->graph1->add($cito, EasyRdf_Namespace::expand('fabio:hasPublicationYear'),$this->citparams['PublicationYear']);
		 		$el = $el . ", Anno di Pubblicazione:". $this->citparams['PublicationYear'];
		 }
		 if (!is_null($citparams['URL'])){
		 		$this->graph1->add($cito, EasyRdf_Namespace::expand('fabio:hasURL'),$this->citparams['URL']);		 
		 		$el = $el . ", URL:". $citparams['URL'];
		 }
		 if (!is_null($citparams['DOI'])){
		 		$this->graph1->add($cito, EasyRdf_Namespace::expand('prism:doi'),$this->citparams['DOI']);
		 		$el = $el . ", DOI:". $this->citparams['DOI'];
		 }
		if (is_null($el))
				$label = "Questo frammento cita:". $this->annotation['body']['object'];
		else
				$label = $el;		 
		 
	}
    	//	$this->graph1->addResource($statement, EasyRdf_Namespace::expand('rdf:object'), $o);// add/addreousrce
        $this->graph1->add($statement, EasyRdf_Namespace::expand('rdfs:label'), EasyRdf_Literal::create($label, null, 'xs:string'));

        return $this;
    }

    public function getGraph()
    {
        return $this->graph1;
    }
} 

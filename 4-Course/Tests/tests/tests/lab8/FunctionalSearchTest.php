<?php

require_once '/home/swnsma/projects/tests/vendor/autoload.php';


class FunctionalSearchTest extends PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser('firefox');
        $this->setBrowserUrl('http://tests.local/index.php');
    }

    protected function scenario()
    {
        $this->openAddressList();
        $fields = $this->getAllField();
        foreach($fields as $text){
            $element = $this->element($this->using('css selector')->value('#search-az > form:nth-child(1) > input:nth-child(1)'));
            $element->clear();
            $element->value($text);
            $newFields = $this->getAllField();
            $this->screenshotInFolder();
            foreach($newFields as $newText){
                if($newText === $text){
                    $this->assertTrue(true);
                    continue 2;
                }
            }
            echo $text;
            $this->assertTrue(false);
        }


    }


    protected function openAddressList()
    {
        $this->url("http://tests.local/index.php");
        $this->screenshotInFolder();
    }


    protected function getAllField(){
        $items = $this->elements($this->using('css selector')->value('#maintable td:not(.center)'));


        $texts = [];
        foreach($items as $item){
            $text = $item->text();
            if($text) {
                $texts[] = $text;
            }
        }
        return $texts;
    }


    public function testRun(){
        $this->scenario();
    }


    public function screenshotInFolder()
    {
        $file = __DIR__ . '/' . __CLASS__ .'/' . $this->getName() . '-' . time() . rand(0, 100) . '.png';
        $this->screenshot($file);
    }


    public function screenshot($file)
    {
        $filedata = $this->currentScreenshot();
        file_put_contents($file, $filedata);
    }

}
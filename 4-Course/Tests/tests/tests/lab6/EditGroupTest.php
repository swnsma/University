<?php

require_once '/home/swnsma/projects/tests/vendor/autoload.php';

class AddToGroup_Test extends \PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser("firefox");
        $this->setBrowserUrl("http://tests.local/index.php");
    }

    public function openAddGroupPage()
    {
        $element = $this->byXPath('//*[@id="content"]/form[2]/input[1]');
        $element->click();
        $element = $this->element($this->using('css selector')->value('input[name="edit"]'));
        $element->click();
    }

    public function getGroupTestData()
    {
        return array(
            'name' => 'a' . rand(100, 10000),
            'header' => "header" .rand(100, 10000),
            'footer' => "footer" .rand(100, 10000)
        );
    }

    public function fillGroupForm($data)
    {
        $element = $this->element($this->using('css selector')->value('input[name="group_name"]'));
        $element->clear();
        $element->value($data['name']);
        $element = $this->element($this->using('css selector')->value('textarea[name="group_header"]'));
        $element->clear();
        $element->value($data['header']);
        $element = $this->element($this->using('css selector')->value('textarea[name="group_footer"]'));
        $element->clear();
        $element->value($data['footer']);
    }

    public function submitCreation()
    {
        $element = $this->element($this->using('css selector')->value('input[name="update"]'));
        $element->click();
    }

    public function openGroupList()
    {
        $this->byXPath('//*[@id="nav"]/ul/li[3]/a')->click();
    }

    public function testScenario()
    {
        $this->openAddressList();
        $this->openGroupList();
        $this->openAddGroupPage();
        $groupData = $this->getGroupTestData();
        $this->fillGroupForm($groupData);
        $this->submitCreation();
        $this->openGroupList();
        $this->assertTrue($this->verify($groupData['name']));

    }

    public function verify($criteria)
    {
        $elements = $this->elements($this->using('css selector')->value('#content input'));
        foreach($elements as $element) {
            if ($element->attribute('title') && strpos($element->attribute('title'), $criteria) !== false) {
                return true;
            }
        }

        return false;
    }

    protected function openAddressList()
    {
        $this->url("http://tests.local/index.php");
    }
}

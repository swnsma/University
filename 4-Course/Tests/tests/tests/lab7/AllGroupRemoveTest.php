<?php

require_once '/home/swnsma/projects/tests/vendor/autoload.php';

class AllGroupRemove_Test extends PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser("firefox");
        $this->setBrowserUrl("http://tests.local/index.php");
    }

    protected $list = array();

    public function openAddGroupPage()
    {
        $element = $this->element($this->using('css selector')->value('input[name="new"]'));
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
        $element->value($data['name']);
        $element = $this->element($this->using('css selector')->value('textarea[name="group_header"]'));
        $element->value($data['header']);
        $element = $this->element($this->using('css selector')->value('textarea[name="group_footer"]'));
        $element->value($data['footer']);
    }

    public function submitCreation()
    {
        $element = $this->element($this->using('css selector')->value('input[name="submit"]'));
        $element->click();
    }

    public function submitDeletion()
    {
        $element = $this->element($this->using('css selector')->value('input[name="delete"]'));
        $element->click();
    }

    public function goToGroupList()
    {
        $this->byXPath('//*[@id="content"]/div/i/a')->click();
    }

    public function openGroupList()
    {
        $this->byXPath('//*[@id="nav"]/ul/li[3]/a')->click();
    }

    public function addGroups()
    {
        $this->openAddressList();
        $iterator = rand(2, 5);
        while($iterator--) {
            $this->openGroupList();
            $this->openAddGroupPage();
            $groupData = $this->getGroupTestData();
            $this->list[] = $groupData['name'];
            $this->fillGroupForm($groupData);
            $this->submitCreation();
            $this->openGroupList();
            $this->assertTrue($this->verify($groupData['name']));
        }
    }

    public function testScenario()
    {
        $this->addGroups();
        $this->openGroupList();
        $this->deleteAllGroups();
        $this->submitDeletion();
        $this->goToGroupList();
        $this->verifyDeletion();
    }

    public function verifyDeletion()
    {
        foreach($this->list as $item) {
            $this->assertFalse($this->verify($item));
        }
    }

    public function deleteAllGroups()
    {
        $elements = $this->elements($this->using('css selector')->value('input[type="checkbox"]'));
        foreach ($elements as $element) {
            $element->click();
        }

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
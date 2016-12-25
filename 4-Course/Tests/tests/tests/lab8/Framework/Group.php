<?php
require_once'Entity.php';


class Group extends Entity
{
    public function openGroupList()
    {
        $this->subject->url('http://tests.local/group.php');
    }

    public function openAddGroupPage()
    {
        $this->subject->byCssSelector('input[name="new"]')->click();
    }

    public function createGroupScenario()
    {
        $this->openGroupList();
        $this->openAddGroupPage();
        $this->fillGroupForm();
        $this->submitCreation();
        $this->openGroupList();
        $this->subject->assertTrue($this->verify());
    }

    public function fillGroupForm()
    {
        $this->subject->byCssSelector('input[name="group_name"]')->value($this->data['name']);
        $this->subject->byCssSelector('textarea[name="group_header"]')->value($this->data['header']);
        $this->subject->byCssSelector('textarea[name="group_footer"]')->value($this->data['footer']);
    }

    public function submitCreation()
    {
        $this->subject->byCssSelector('input[name="submit"]')->click();
    }

    public function verify()
    {
        /** @var PHPUnit_Extensions_Selenium2TestCase_Element[] $elements */
        $elements = $this->subject->elements($this->subject->using('css selector')->value('#content input'));
        /** @var PHPUnit_Extensions_Selenium2TestCase_Element $element */
        foreach($elements as $element) {
            if ($element->attribute('title') && strpos($element->attribute('title'), $this->data['name']) !== false) {
                return true;
            }
        }

        return false;
    }

    public function deleteGroupScenario()
    {
        $this->openGroupList();
        $this->deleteGroup();
        $this->subject->assertFalse($this->verify());
    }

    public function deleteGroup()
    {
        $this->_selectElement();
        $this->_deleteElement();
    }

    protected function _selectElement()
    {
        $this->subject->byCssSelector('input[title="Select (' . $this->data['name'] . ')"' . "]")->click();
    }

    protected function _deleteElement()
    {
        $this->subject->byCssSelector('input[name="delete"]')->click();
    }

}
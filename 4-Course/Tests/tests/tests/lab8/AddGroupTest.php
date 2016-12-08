<?php

require_once '/home/swnsma/projects/tests/vendor/autoload.php';

class Address_AddToGroup_Test extends \PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser("firefox");
        $this->setBrowserUrl("http://tests.local/index.php");
    }


    public function testScenario()
    {
        $this->openAddressList();


        $countAddress = $this->getAddressCount();
        $countGroups = $this->getGroupCount();
        $selectAddress = rand(1, $countAddress);
        $selectGroup = rand(1, $countGroups);


        $this->selectAddress($selectAddress);
        $this->addAddressToGroup($selectGroup);
        $this->openAddressList();
        $this->byCssSelector('select[name="group"]')->click();


        $group = $this->elements($this->using('css selector')->value('select[name="group"] option'))[$selectGroup + 2 - 1];
        $group->click();


        $selectAddressId = $this->getSelectAddressId($selectAddress);


        $value = $this->byCssSelector("#maintable tr td input[id={$selectAddressId}]");
        if ($value) {
            $this->assertTrue(true);
        } else {
            $this->assertTrue(false);
        }
    }
    protected function addAddressToGroup($selectGroup)
    {
        $this->byCssSelector('select[name="to_group"]')->click();


        $group = $this->elements($this->using('css selector')->value('select[name="to_group"] option'))[$selectGroup - 1];
        $group->click();


        $this->byCssSelector('form[name="MainForm"] input[name="add"]')->click();
        $this->byCssSelector('form[name="MainForm"] input[name="add"]')->click();
    }


    protected function getSelectAddress($selectAddress)
    {
        return $this->elements($this->using('css selector')->value('#maintable tr td input'))[$selectAddress - 1];
    }
    protected function selectAddress($selectAddress)
    {
        $this->getSelectAddress($selectAddress)->click();
    }


    protected function getSelectAddressId($selectAddress)
    {
        return $this->getSelectAddress($selectAddress)->attribute('id');
    }


    protected function openAddressList()
    {
        $this->url("http://tests.local/index.php");
    }
    protected function getAddressCount()
    {
        $items = $this->elements($this->using('css selector')->value('#maintable tr td input'));
        return count($items) - 1;
    }
    protected function getGroupCount()
    {
        $items = $this->elements($this->using('css selector')->value('select[name="to_group"] option'));
        return count($items);
    }
}

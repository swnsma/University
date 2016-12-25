<?php
require_once'Entity.php';

class Record extends Entity
{
    public function openAddressList()
    {
        $this->subject->url("http://tests.local/index.php");
    }

    public function createRecordScenario()
    {
        $this->openAddNewPage();
        $this->fillContactForm();
        $this->submitCreation();
        $this->openAddressList();
        $this->subject->assertTrue($this->verify());
    }

    public function fillContactForm()
    {
        $this->subject->byCssSelector('input[name="firstname"]')->value($this->data['firstname']);
        $this->subject->byCssSelector('input[name="lastname"]')->value($this->data['lastname']);
        $this->subject->byCssSelector('textarea[name="address"]')->value($this->data['address']);
        $this->subject->byCssSelector('input[name="home"]')->value($this->data['home']);
        $this->subject->byCssSelector('input[name="mobile"]')->value($this->data['mobile']);
        $this->subject->byCssSelector('input[name="work"]')->value($this->data['work']);
        $this->subject->byCssSelector('input[name="email"]')->value($this->data['email']);
        $this->subject->byCssSelector('input[name="email2"]')->value($this->data['email2']);


        $this->subject->select($this->subject->byCssSelector('select[name="bday"]'))
            ->selectOptionByValue($this->data['bday']);
        $this->subject->select($this->subject->byCssSelector('select[name="bmonth"]'))
            ->selectOptionByValue($this->data['bmonth']);

        $this->subject->byCssSelector('input[name="byear"]')->value($this->data['byear']);

        if (isset($this->data['group'])) {
            $this->subject->select($this->subject->byCssSelector('select[name="new_group"]'))
                ->selectOptionByLabel($this->data['group']);
        }

        $this->subject->byCssSelector('textarea[name="address2"]')->value($this->data['address2']);
        $this->subject->byCssSelector('input[name="phone2"]')->value($this->data['phone2']);
    }

    public function openAddNewPage()
    {
        $this->subject->url('http://tests.local/edit.php');
    }

    public function submitCreation()
    {
        $this->subject->byCssSelector('input[name="submit"]')->click();
    }

    public function verify()
    {
        $elements = $this->subject->elements($this->subject->using('css selector')->value('#maintable td'));
        $checks = array(
            'firstname' => false,
            'lastname' => false,
            'home' => false
        );

        foreach($checks as $key => $check) {
            /** @var PHPUnit_Extensions_Selenium2TestCase_ElementCriteria $element */
            foreach($elements as $element) {
                if ($element->text() == $this->data[$key]) {
                    continue 2;
                }
            }
            return false;
        }
        $elements = $this->subject->elements($this->subject->using('css selector')->value('#maintable td a'));

        /** @var PHPUnit_Extensions_Selenium2TestCase_ElementCriteria $element */
        foreach($elements as $element) {
            if ($element->text() == $this->data['email']) {
                return true;
            }
        }

        return false;
    }

    public function deleteRecordScenario()
    {
        $this->openAddressList();
        $this->deleteRecord();
        $this->subject->assertFalse($this->verify());
    }

    public function deleteRecord()
    {
        $this->_selectElement();
        $this->_deleteElement();
        $this->_goToHomePage();
    }


    protected function _goToHomePage()
    {
        $this->subject->byXPath('//*[@id="content"]/div/i/a')->click();
    }

    protected function _selectElement()
    {
        $this->subject->byXPath('//*[@id="maintable"]/tbody/tr/td[text()="' . $this->data['firstname'] . '"]/../td/a/img[@title="Edit"]/..')
            ->click();
    }

    protected function _deleteElement()
    {
        $this->subject->byCssSelector('input[value="Delete"]')->click();
    }
}
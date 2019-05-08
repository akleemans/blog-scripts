describe('Mobile number cost', () => {

  const controller = new PhoneNumberCtrl();

  it('should create', () => {
    expect(controller).toBeDefined();
  });

  describe('Category B', () => {
    it('should recognize 5-7 same digits at the end', () => {
      expect(controller.getCategory('0791111111')).toBe('B');
      expect(controller.subcategory).toBe('5-7 same digits at the end');

      expect(controller.getCategory('0792111111')).toBe('B');
      expect(controller.subcategory).toBe('5-7 same digits at the end');

      expect(controller.getCategory('0792311111')).toBe('B');
      expect(controller.subcategory).toBe('5-7 same digits at the end');

      expect(controller.getCategory('0799999999')).toBe('B');
      expect(controller.subcategory).toBe('5-7 same digits at the end');
    });

    it('should recognize 3 equal 3-digit block', () => {
      expect(controller.getCategory('0791791791')).toBe('B');
      expect(controller.subcategory).toBe('3 equal 3-digit blocks');

      expect(controller.getCategory('0753753753')).toBe('B');
      expect(controller.subcategory).toBe('3 equal 3-digit blocks');
    });

  });

});

jQuery(function () {
	let countries = [];
	const eMailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
		passwordRegex = new RegExp(
			/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#\$%\^\&*\)\(+=._-])[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{3,}$/
		);

	$.ajax({
		url: './js/countries.json',
	}).then((data) => {
		countries = data.countries;
		countries.forEach((el) => {
			$('<option/>', {
				value: el.name,
				html: el.name,
			}).appendTo($('.registration__form-country'));
		});
		$('select').niceSelect();
	});

	function parallax() {
		let scrolled = $(window).scrollTop() + 1;

		$('.firstpage').css('background-position', `0 ${scrolled * 0.3}px`);
		$('.registration').css('background-position', `0 ${scrolled * 0.3 - window.innerHeight * 0.3}px`);
	}

	$(window).scroll((e) => {
		parallax();
	});

	ScrollOut({
		targets: '.registration__form-wrapper',
		threshold: 0.5,
		once: true,
	});

	$('.firstpage__scrollbutton').on('click', (e) => {
		e.preventDefault();
		const body = $('html,body'),
			section = $('#registration');
		let position = section.offset().top - body.offset().top + body.scrollTop();
		body.animate({
			scrollTop: position,
		});
	});

	$('.registration__form-country').on('change', (e) => {
		let index = countries.findIndex((el) => el.name === e.currentTarget.value);
		$('.registration__form-phone').val(`${countries[index].code} `);
	});

	function invalidInput(element) {
		element.siblings($('span')).removeClass('hidden');
		setTimeout(() => {
			element.siblings($('span')).addClass('hidden');
		}, 4000);
	}

	$('.registration__form-submit').on('click', (e) => {
		e.preventDefault();
		let result = {};
		const $firstName = $('.registration__form-firstname'),
			$secondName = $('.registration__form-secondname'),
			$country = $('.registration__form-country'),
			$phone = $('.registration__form-phone'),
			$email = $('.registration__form-email'),
			$password = $('.registration__form-password'),
			$passwordConfirm = $('.registration__form-passwordconfirm'),
			$checkbox = $('.registration__form-checkbox-box');
		$firstName.val().length <= 2 ? invalidInput($firstName) : (result.firstName = $firstName.val());
		$secondName.val().length <= 2 ? invalidInput($secondName) : (result.secondName = $secondName.val());
		!$country.val() ? invalidInput($country) : (result.country = $country.val());
		!$phone.val() ? invalidInput($phone) : (result.phone = $phone.val());
		!eMailRegex.test($email.val()) ? invalidInput($email) : (result.email = $email.val());
		if (!passwordRegex.test($password.val())) invalidInput($password);
		!($passwordConfirm.val() === $password.val())
			? invalidInput($passwordConfirm)
			: (result.password = $password.val());
		if (!$checkbox.prop('checked')) {
			$checkbox.siblings('label').addClass('registration__form-checkbox-label-unchecked');
			setTimeout(() => {
				$checkbox.siblings('label').removeClass('registration__form-checkbox-label-unchecked');
			}, 4000);
		}
		if (Object.keys(result).length === 6 && result.password && $checkbox.prop('checked')) console.log(result);
	});
});
